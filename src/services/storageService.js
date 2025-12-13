// Service để lưu trữ dữ liệu like và donate
// Sử dụng GitHub Gist API để lưu trữ persistent data

const GIST_ID = import.meta.env.VITE_GITHUB_GIST_ID;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GIST_FILE_NAME = 'nuoitoi-stats.json';

// Fallback về localStorage nếu không có config
const USE_GIST = GIST_ID && GITHUB_TOKEN;

// Log để debug
if (USE_GIST) {
  console.log('✅ Using GitHub Gist API');
  console.log('📝 Gist ID:', GIST_ID);
  console.log('🔑 Token:', GITHUB_TOKEN ? '***' + GITHUB_TOKEN.slice(-4) : 'Missing');
} else {
  console.warn('⚠️ Using localStorage (fallback)');
  console.log('📝 Gist ID:', GIST_ID || 'Missing');
  console.log('🔑 Token:', GITHUB_TOKEN ? 'Present' : 'Missing');
}

// Lấy dữ liệu từ Gist
const getGistData = async () => {
  if (!USE_GIST) {
    return getLocalStorageData();
  }

  try {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const gist = await response.json();
    
    // Ưu tiên tìm file nuoitoi-stats.json
    let file = gist.files[GIST_FILE_NAME];
    
    // Nếu không tìm thấy, tìm file có tên chứa "nuoitoi" hoặc "stats"
    if (!file) {
      const fileNames = Object.keys(gist.files);
      file = fileNames.find(name => 
        name.toLowerCase().includes('nuoitoi') || 
        name.toLowerCase().includes('stats')
      ) ? gist.files[fileNames.find(name => 
        name.toLowerCase().includes('nuoitoi') || 
        name.toLowerCase().includes('stats')
      )] : null;
    }
    
    // Nếu vẫn không tìm thấy, lấy file đầu tiên
    if (!file && Object.keys(gist.files).length > 0) {
      const firstFileName = Object.keys(gist.files)[0];
      file = gist.files[firstFileName];
    }
    
    if (!file) {
      // Tạo file mới nếu chưa có
      return { likes: 0, donates: 0, userLikes: {} };
    }

    try {
      return JSON.parse(file.content);
    } catch (error) {
      // Nếu parse lỗi, trả về data mặc định
      console.error('Error parsing Gist content:', error);
      return { likes: 0, donates: 0, userLikes: {} };
    }
  } catch (error) {
    console.error('Error fetching from Gist:', error);
    // Fallback về localStorage nếu Gist fail
    return getLocalStorageData();
  }
};

// Lưu dữ liệu vào Gist
const saveGistData = async (data) => {
  if (!USE_GIST) {
    return saveLocalStorageData(data);
  }

  try {
    // Lấy Gist hiện tại để giữ lại các file khác
    const getResponse = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
      }
    });

    if (!getResponse.ok) {
      throw new Error(`GitHub API error (GET): ${getResponse.status}`);
    }

    const currentGist = await getResponse.json();
    
    // Tạo object files với tất cả files hiện tại
    const files = {};
    
    // Giữ lại tất cả files hiện tại
    Object.keys(currentGist.files || {}).forEach(fileName => {
      files[fileName] = {
        content: currentGist.files[fileName].content
      };
    });
    
    // Update hoặc tạo file nuoitoi-stats.json
    files[GIST_FILE_NAME] = {
      content: JSON.stringify(data, null, 2)
    };

    // Update Gist
    const patchResponse = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
      },
      body: JSON.stringify({
        files: files
      })
    });

    if (!patchResponse.ok) {
      const errorText = await patchResponse.text();
      console.error('GitHub API error response:', errorText);
      throw new Error(`GitHub API error (PATCH): ${patchResponse.status} - ${errorText}`);
    }

    const result = await patchResponse.json();
    console.log('✅ Gist updated successfully:', result.files[GIST_FILE_NAME] ? 'File found' : 'File not found');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error saving to Gist:', error);
    // Fallback về localStorage
    saveLocalStorageData(data);
    return { success: false, error: error.message };
  }
};

// Fallback: LocalStorage functions
const getLocalStorageData = () => {
  try {
    const likes = parseInt(localStorage.getItem('nuoitoi_likes') || '0', 10);
    const donates = parseInt(localStorage.getItem('nuoitoi_donates') || '0', 10);
    return { likes, donates, userLikes: {} };
  } catch (error) {
    return { likes: 0, donates: 0, userLikes: {} };
  }
};

const saveLocalStorageData = (data) => {
  try {
    localStorage.setItem('nuoitoi_likes', data.likes.toString());
    localStorage.setItem('nuoitoi_donates', data.donates.toString());
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Tạo user ID đơn giản (dựa trên browser fingerprint)
const getUserID = () => {
  try {
    let userId = localStorage.getItem('nuoitoi_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('nuoitoi_user_id', userId);
    }
    return userId;
  } catch (error) {
    return `user_${Date.now()}`;
  }
};

// Lấy số lượt like
export const getLikes = async () => {
  try {
    const data = await getGistData();
    console.log('📊 Loaded likes from Gist:', data.likes || 0);
    return data.likes || 0;
  } catch (error) {
    console.error('Error getting likes:', error);
    return 0;
  }
};

// Tăng số lượt like
export const incrementLike = async () => {
  try {
    const userId = getUserID();
    console.log('👍 User ID:', userId);
    
    const data = await getGistData();
    console.log('📊 Current data:', data);
    
    // Kiểm tra user đã like chưa
    if (data.userLikes && data.userLikes[userId]) {
      console.log('⚠️ User đã like rồi');
      return { success: false, message: 'Bạn đã like rồi!', count: data.likes || 0 };
    }
    
    // Tăng like
    const newLikes = (data.likes || 0) + 1;
    const updatedData = {
      ...data,
      likes: newLikes,
      userLikes: {
        ...(data.userLikes || {}),
        [userId]: Date.now()
      }
    };
    
    console.log('💾 Saving to Gist:', updatedData);
    const saveResult = await saveGistData(updatedData);
    console.log('✅ Save result:', saveResult);
    
    if (saveResult.success) {
      return { success: true, count: newLikes };
    } else {
      return { success: false, message: saveResult.error || 'Không thể lưu vào Gist', count: data.likes || 0 };
    }
  } catch (error) {
    console.error('❌ Error incrementing like:', error);
    return { success: false, message: 'Có lỗi xảy ra: ' + error.message, count: 0 };
  }
};

// Kiểm tra user đã like chưa
export const hasUserLiked = async () => {
  try {
    const userId = getUserID();
    const data = await getGistData();
    return !!(data.userLikes && data.userLikes[userId]);
  } catch (error) {
    return false;
  }
};

// Lấy số lượt donate
export const getDonates = async () => {
  try {
    const data = await getGistData();
    return data.donates || 0;
  } catch (error) {
    console.error('Error getting donates:', error);
    return 0;
  }
};

// Tăng số lượt donate
export const incrementDonate = async () => {
  try {
    const data = await getGistData();
    const newDonates = (data.donates || 0) + 1;
    
    const updatedData = {
      ...data,
      donates: newDonates
    };
    
    await saveGistData(updatedData);
    return { success: true, count: newDonates };
  } catch (error) {
    console.error('Error incrementing donate:', error);
    return { success: false, message: 'Có lỗi xảy ra', count: 0 };
  }
};

// Reset data (để test - chỉ hoạt động với Gist)
export const resetData = async () => {
  if (!USE_GIST) {
    try {
      localStorage.removeItem('nuoitoi_likes');
      localStorage.removeItem('nuoitoi_donates');
      localStorage.removeItem('nuoitoi_user_id');
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  try {
    const emptyData = { likes: 0, donates: 0, userLikes: {} };
    await saveGistData(emptyData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
