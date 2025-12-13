// Cấu hình thông tin donate
// Cập nhật thông tin tài khoản của bạn ở đây

export const donateInfo = {
  // Thông tin ngân hàng
  bank: {
    name: 'Vietcombank', // Tên ngân hàng
    accountNumber: '0123456789', // Số tài khoản
    accountName: 'NGUYEN VAN A', // Tên chủ tài khoản
    transferNote: 'NUOI TOI' // Nội dung chuyển khoản
  },

  // Ví điện tử
  eWallet: {
    momo: {
      phone: '0901234567', // Số điện thoại MoMo
      qrCode: '' // Link hoặc URL QR code MoMo (nếu có)
    },
    zalopay: {
      phone: '0901234567', // Số điện thoại ZaloPay
      qrCode: '' // Link hoặc URL QR code ZaloPay (nếu có)
    }
  },

  // VietQR - Tự động tạo QR code từ thông tin ngân hàng
  // Format: https://api.vietqr.io/image/{accountNumber}.jpg?accountName={accountName}&amount={amount}&addInfo={transferNote}
  vietQR: {
    enabled: true, // Bật/tắt VietQR
    // QR code sẽ được tạo tự động từ thông tin bank ở trên
  }
};

// Helper function để tạo VietQR URL
export const getVietQRUrl = (amount = 0) => {
  const { bank } = donateInfo;
  const params = new URLSearchParams({
    accountName: bank.accountName,
    amount: amount.toString(),
    addInfo: bank.transferNote
  });
  return `https://api.vietqr.io/image/${bank.accountNumber}.jpg?${params.toString()}`;
};

