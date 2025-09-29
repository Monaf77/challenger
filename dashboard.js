import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

// عناصر واجهة المستخدم
const userInfo = document.getElementById('userInfo');
const guestInfo = document.getElementById('guestInfo');
const userName = document.getElementById('userName');
const signOutBtn = document.getElementById('signOutBtn');
const createServerBtn = document.getElementById('createServerBtn');
const createServerModal = document.getElementById('createServerModal');
const closeModal = document.querySelector('.close-modal');
const serverForm = document.getElementById('serverForm');
const serverVersion = document.getElementById('serverVersion');
const pluginOptions = document.getElementById('pluginOptions');
const serversList = document.getElementById('serversList');

// استمع لتغييرات حالة المصادقة
onAuthStateChanged(auth, (user) => {
    if (user) {
        // المستخدم مسجل الدخول
        userInfo.style.display = 'block';
        guestInfo.style.display = 'none';
        userName.textContent = user.email.split('@')[0];
        
        // جلب السيرفرات الخاصة بالمستخدم
        loadUserServers(user.uid);
    } else {
        // المستخدم غير مسجل الدخول
        userInfo.style.display = 'none';
        guestInfo.style.display = 'block';
        window.location.href = 'login.html';
    }
});

// تسجيل الخروج
if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
            alert('حدث خطأ أثناء محاولة تسجيل الخروج');
        }
    });
}

// فتح نافذة إنشاء سيرفر جديد
if (createServerBtn) {
    createServerBtn.addEventListener('click', () => {
        createServerModal.style.display = 'flex';
    });
}

// إغلاق نافذة إنشاء سيرفر جديد
if (closeModal) {
    closeModal.addEventListener('click', () => {
        createServerModal.style.display = 'none';
    });
}

// إغلاق النافذة المنبثقة عند النقر خارجها
window.addEventListener('click', (e) => {
    if (e.target === createServerModal) {
        createServerModal.style.display = 'none';
    }
});

// إظهار/إخفاء خيارات البلجنات حسب نوع السيرفر
if (serverVersion) {
    serverVersion.addEventListener('change', (e) => {
        pluginOptions.style.display = e.target.value === 'vanilla' ? 'none' : 'block';
    });
}

// معالجة إنشاء سيرفر جديد
if (serverForm) {
    serverForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        const serverName = document.getElementById('serverName').value;
        const version = serverVersion.value;
        const selectedPlugins = Array.from(document.querySelectorAll('input[name="plugins"]:checked'))
            .map(checkbox => checkbox.value);
        
        try {
            // إنشاء معرف فريد للسيرفر
            const serverId = `srv_${Math.random().toString(36).substr(2, 9)}`;
            
            // إنشاء عنوان URL للسيرفر
            const serverUrl = `com.${serverName.toLowerCase().replace(/\s+/g, '')}.challenger`;
            
            // إنشاء منفذ عشوائي بين 25565 و 30000
            const port = Math.floor(Math.random() * (30000 - 25565 + 1)) + 25565;
            
            // حفظ بيانات السيرفر في Firestore
            await addDoc(collection(db, 'servers'), {
                id: serverId,
                name: serverName,
                version: version,
                url: serverUrl,
                port: port,
                plugins: selectedPlugins,
                ownerId: user.uid,
                status: 'starting',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            
            // إغلاق النافذة المنبثقة وتحديث القائمة
            createServerModal.style.display = 'none';
            serverForm.reset();
            loadUserServers(user.uid);
            
            // إشعار بنجاح الإنشاء
            alert(`تم إنشاء السيرفر بنجاح!\nعنوان السيرفر: ${serverUrl}\nالمنفذ: ${port}`);
            
        } catch (error) {
            console.error('خطأ في إنشاء السيرفر:', error);
            alert('حدث خطأ أثناء محاولة إنشاء السيرفر');
        }
    });
}

// دالة لجلب سيرفرات المستخدم
async function loadUserServers(userId) {
    try {
        const q = query(collection(db, 'servers'), where('ownerId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            serversList.innerHTML = `
                <div class="no-servers">
                    <i class="fas fa-server" style="font-size: 3rem; opacity: 0.5; margin-bottom: 1rem;"></i>
                    <p>لا توجد سيرفرات حتى الآن</p>
                </div>
            `;
            return;
        }
        
        let serversHTML = '';
        querySnapshot.forEach((doc) => {
            const server = doc.data();
            serversHTML += `
                <div class="server-card">
                    <div class="server-header">
                        <h3>${server.name}</h3>
                        <span class="server-version">${server.version}</span>
                    </div>
                    <div class="server-details">
                        <p><i class="fas fa-link"></i> ${server.url}</p>
                        <p><i class="fas fa-plug"></i> ${server.port}</p>
                        <p>
                            <span class="server-status ${server.status}"></span>
                            ${server.status === 'online' ? 'يعمل' : 'متوقف'}
                        </p>
                    </div>
                    <div class="server-actions">
                        <button class="btn btn-sm" onclick="startServer('${server.id}')">
                            <i class="fas fa-play"></i> تشغيل
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="stopServer('${server.id}')">
                            <i class="fas fa-stop"></i> إيقاف
                        </button>
                    </div>
                </div>
            `;
        });
        
        serversList.innerHTML = serversHTML;
        
    } catch (error) {
        console.error('خطأ في جلب السيرفرات:', error);
        serversList.innerHTML = '<p>حدث خطأ أثناء تحميل السيرفرات. يرجى تحديث الصفحة والمحاولة مرة أخرى.</p>';
    }
}

// دالة لبدء تشغيل السيرفر
window.startServer = async (serverId) => {
    try {
        // هنا سيتم إضافة كود بدء تشغيل السيرفر
        alert(`جاري بدء تشغيل السيرفر ${serverId}...`);
        // سيتم تحديث حالة السيرفر في Firestore
    } catch (error) {
        console.error('خطأ في بدء تشغيل السيرفر:', error);
        alert('حدث خطأ أثناء محاولة بدء تشغيل السيرفر');
    }
};

// دالة لإيقاف السيرفر
window.stopServer = async (serverId) => {
    try {
        // هنا سيتم إضافة كود إيقاف السيرفر
        const confirmStop = confirm('هل أنت متأكد من إيقاف السيرفر؟');
        if (confirmStop) {
            alert(`جاري إيقاف السيرفر ${serverId}...`);
            // سيتم تحديث حالة السيرفر في Firestore
        }
    } catch (error) {
        console.error('خطأ في إيقاف السيرفر:', error);
        alert('حدث خطأ أثناء محاولة إيقاف السيرفر');
    }
};
