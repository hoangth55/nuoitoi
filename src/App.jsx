import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getLikes, incrementLike, hasUserLiked, getDonates, incrementDonate } from './services/storageService';
import { donateInfo, getVietQRUrl } from './config/donateInfo';

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  color: #4a5568;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Section = styled.section`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Hero = styled(Section)`
  text-align: center;
  padding: 3rem 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #2d3748;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.5rem;
  color: #4a5568;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: #2d3748;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CommitmentsList = styled.ul`
  list-style: none;
  max-width: 800px;
  margin: 0 auto;
`;

const CommitmentItem = styled.li`
  padding: 1rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 10px;
  border-left: 4px solid #667eea;
  font-size: 1.05rem;
  line-height: 1.6;

  strong {
    color: #2d3748;
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ComparisonCard = styled.div`
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  background: ${props => 
    props.variant === 'negative' 
      ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
      : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  };

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #2d3748;
  }

  ul {
    list-style: none;
  }

  li {
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 1.05rem;
    line-height: 1.6;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const DonateSection = styled(Section)`
  text-align: center;
`;

const DonateTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2d3748;
`;

const QRPlaceholder = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  border-radius: 15px;
  color: white;
  margin-bottom: 2rem;
`;

const QRCode = styled.div`
  font-size: 8rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 5rem;
  }
`;

const QRText = styled.p`
  font-size: 1.2rem;
  margin: 0.5rem 0;
`;

const HighlightText = styled.p`
  font-size: 1.3rem !important;
  font-weight: bold;
  margin-top: 1rem !important;
`;

const GiftBox = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 2rem;
  border-radius: 15px;
  color: white;

  h3 {
    font-size: 1.8rem;
  }
`;

const BudgetList = styled.div`
  max-width: 800px;
  margin: 0 auto 2rem;
`;

const BudgetItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1.2rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 10px;
  border-left: 4px solid #667eea;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BudgetPercent = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  min-width: 80px;
  margin-right: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

const BudgetDesc = styled.span`
  font-size: 1.05rem;
  line-height: 1.6;
  color: #2d3748;
`;

const BudgetNote = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #4a5568;
  font-style: italic;
`;

const MessageContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;

  p {
    margin-bottom: 1.5rem;
  }

  strong {
    color: #2d3748;
  }
`;

const PSBox = styled.p`
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 10px;
  color: white;
`;

const Disclaimer = styled(Section)`
  text-align: center;
  font-size: 0.95rem;
  color: #4a5568;
  border: 2px solid #ffd700;
`;

const Footer = styled.footer`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  text-align: center;
  color: #4a5568;
  margin-top: auto;
`;

const StatsSection = styled(Section)`
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 15px;
  color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const LikeButton = styled.button`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DonateButton = styled.button`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const PaymentCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const PaymentIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const PaymentTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #2d3748;
`;

const PaymentInfo = styled.div`
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 1rem;
  word-break: break-all;
`;

const CopyButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const QRCodeImage = styled.img`
  width: 200px;
  height: 200px;
  margin: 1rem auto;
  display: block;
  border-radius: 10px;
  background: white;
  padding: 1rem;
`;

const BankInfo = styled.div`
  text-align: left;
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.8;
`;

const BankRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const BankLabel = styled.strong`
  color: #2d3748;
  min-width: 120px;
`;

const BankValue = styled.span`
  color: #4a5568;
  text-align: right;
`;

const CharityWarning = styled(Section)`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  border: 3px solid #ffd700;
  box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3);
`;

const CharityTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: white;
  text-align: center;
`;

const CharityText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  text-align: center;
  
  strong {
    font-size: 1.3rem;
    color: #ffd700;
  }
`;

const CharityAccounts = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 15px;
  margin-top: 2rem;
  color: #2d3748;
`;

const CharityAccountItem = styled.div`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 10px;
  border-left: 4px solid #667eea;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CharityBankName = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #2d3748;
`;

const CharityAccountInfo = styled.div`
  font-size: 1rem;
  line-height: 1.8;
  
  strong {
    color: #667eea;
  }
`;

const HospitalInfo = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 15px;
  margin-top: 2rem;
  color: #2d3748;
`;

const HospitalItem = styled.div`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  border-radius: 10px;
  border-left: 4px solid #ff6b6b;
  color: white;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const HospitalName = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: white;
`;

const HospitalDetails = styled.div`
  font-size: 1rem;
  line-height: 1.8;
  
  div {
    margin-bottom: 0.5rem;
  }
  
  strong {
    color: #ffd700;
  }
`;

function App() {
  const [likes, setLikes] = useState(0);
  const [donates, setDonates] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data khi component mount
    const loadData = async () => {
      try {
        setLoading(true);
        const [likesCount, donatesCount, hasLiked] = await Promise.all([
          getLikes(),
          getDonates(),
          hasUserLiked()
        ]);
        setLikes(likesCount);
        setDonates(donatesCount);
        setUserLiked(hasLiked);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleLike = async () => {
    if (userLiked) return;
    
    try {
      console.log('🔄 Starting like...');
      const result = await incrementLike();
      console.log('📥 Like result:', result);
      
      if (result.success) {
        setLikes(result.count);
        setUserLiked(true);
        console.log('✅ Like successful, count:', result.count);
      } else {
        console.error('❌ Like failed:', result.message);
        alert(result.message || 'Có lỗi xảy ra. Vui lòng mở Console (F12) để xem chi tiết.');
      }
    } catch (error) {
      console.error('❌ Error liking:', error);
      alert('Có lỗi xảy ra khi like: ' + error.message + '\nVui lòng mở Console (F12) để xem chi tiết.');
    }
  };

  const handleDonate = async () => {
    try {
      const result = await incrementDonate();
      if (result.success) {
        setDonates(result.count);
      } else {
        alert(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error donating:', error);
      alert('Có lỗi xảy ra khi donate');
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Đã copy ${label} vào clipboard!`);
    }).catch(() => {
      // Fallback cho browser cũ
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`Đã copy ${label} vào clipboard!`);
    });
  };

  return (
    <AppContainer>
      <Header>
        <Logo>🌱 NUÔI TÔI 🌱</Logo>
      </Header>

      <MainContent>
        <Hero>
          <HeroTitle>🌱 NUÔI TÔI 🌱</HeroTitle>
          <Tagline>
            <strong>HÃY NUÔI TÔI.</strong>
            <br />
            Tôi hứa sao kê đầy đủ! 💯
          </Tagline>
          <LikeButton onClick={handleLike} disabled={userLiked}>
            {userLiked ? '❤️ Đã Like' : '🤍 Like'} {likes > 0 && `(${likes})`}
          </LikeButton>
        </Hero>

        <Section>
          <SectionTitle>🎯 Tại Sao Nên Nuôi Tôi?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureTitle>Sao Kê Realtime</FeatureTitle>
              <FeatureDescription>
                Cập nhật từng giây! Còn nhanh hơn cả tốc độ bạn chuyển tiền!
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🔍</FeatureIcon>
              <FeatureTitle>Minh Bạch 300%</FeatureTitle>
              <FeatureDescription>
                Hơn cả 100%! Từ ly trà sữa đến cốc bia, ly cafe đều sao kê đầy đủ!
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>💸</FeatureIcon>
              <FeatureTitle>Chi Tiêu Hợp Lý</FeatureTitle>
              <FeatureDescription>
                Không mua xe hơi, nhà cửa. Chỉ ăn cơm với mì tôm thôi!
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>📱</FeatureIcon>
              <FeatureTitle>App Tracking</FeatureTitle>
              <FeatureDescription>
                Theo dõi 24/7 tôi ăn gì, uống gì, đi đâu. Như "Big Brother" vậy!
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Section>

        <Section>
          <SectionTitle>🎪 Cam Kết Vàng Của Tôi:</SectionTitle>
          <CommitmentsList>
            <CommitmentItem>
              <strong>Sao kê mỗi ngày:</strong> Cập nhật lúc 6h sáng, đều như vắt chanh! (Kể cả Chủ Nhật & Lễ)
            </CommitmentItem>
            <CommitmentItem>
              <strong>Không giấu giếm:</strong> Từ tô phở 50k đến hộp sữa chua 8k, từ cốc bia 30k đến ly cafe 25k đều được ghi chép tỉ mỉ!
            </CommitmentItem>
            <CommitmentItem>
              <strong>Beer & Cafe đều sao kê:</strong> Đi uống bia với bạn, cafe làm việc, tất cả đều có hóa đơn, chụp ảnh check-in, và báo cáo đầy đủ! Không có gì bị "quên"!
            </CommitmentItem>
            <CommitmentItem>
              <strong>Có hóa đơn chứng từ:</strong> Chụp hình bill, quét mã vạch, lưu biên lai đầy đủ!
            </CommitmentItem>
            <CommitmentItem>
              <strong>Video unboxing:</strong> Mở từng gói mì tôm live trên Facebook cho anh chị xem!
            </CommitmentItem>
            <CommitmentItem>
              <strong>Hotline 24/7:</strong> Gọi hỏi tôi ăn gì bất cứ lúc nào, kể cả 3h sáng!
            </CommitmentItem>
            <CommitmentItem>
              <strong>Không block:</strong> Hỏi khó đến mấy cũng trả lời, không "đã xem" rồi im lặng!
            </CommitmentItem>
          </CommitmentsList>
        </Section>

        <Section>
          <SectionTitle>💰 So Sánh Với "Người Khác"</SectionTitle>
          <ComparisonGrid>
            <ComparisonCard variant="negative">
              <h3>❌ Người Khác:</h3>
              <ul>
                <li>Sao kê sau 3 năm (hoặc không bao giờ)</li>
                <li>File Excel blur mờ như ảnh ma</li>
                <li>Số liệu "làm tròn" theo kiểu 1 + 1 = 3</li>
                <li>Block người hỏi nhanh như chớp</li>
              </ul>
            </ComparisonCard>
            <ComparisonCard variant="positive">
              <h3>✅ Nuôi Tôi:</h3>
              <ul>
                <li>Sao kê trước khi tiêu (để anh chị duyệt)</li>
                <li>File Excel 4K Ultra HD, có chữ ký điện tử</li>
                <li>Số liệu chính xác đến từng đồng</li>
                <li>Beer, cafe đều sao kê đầy đủ, không giấu giếm!</li>
                <li>Trả lời inbox nhanh hơn cả chatbot</li>
              </ul>
            </ComparisonCard>
          </ComparisonGrid>
        </Section>

        <DonateSection>
          <DonateTitle>💳 DONATE NGAY ĐI, NẾU BẠN ĐANG CƯỜI!</DonateTitle>
          <QRText style={{ marginBottom: '2rem', color: '#4a5568' }}>
            Chọn phương thức thanh toán phù hợp với bạn. Sau khi chuyển khoản, click nút "Đã Donate" để cập nhật số lượt!
          </QRText>
          
          <PaymentMethods>
            <PaymentCard>
              <PaymentIcon>🏦</PaymentIcon>
              <PaymentTitle>Chuyển Khoản Ngân Hàng</PaymentTitle>
              <BankInfo>
                <BankRow>
                  <BankLabel>Ngân hàng:</BankLabel>
                  <BankValue>{donateInfo.bank.name}</BankValue>
                </BankRow>
                <BankRow>
                  <BankLabel>Số tài khoản:</BankLabel>
                  <BankValue>{donateInfo.bank.accountNumber}</BankValue>
                </BankRow>
                <BankRow>
                  <BankLabel>Chủ tài khoản:</BankLabel>
                  <BankValue>{donateInfo.bank.accountName}</BankValue>
                </BankRow>
                <BankRow>
                  <BankLabel>Nội dung:</BankLabel>
                  <BankValue>{donateInfo.bank.transferNote}</BankValue>
                </BankRow>
              </BankInfo>
              <CopyButton onClick={() => copyToClipboard(donateInfo.bank.accountNumber, 'Số tài khoản')}>
                📋 Copy số TK
              </CopyButton>
            </PaymentCard>

          </PaymentMethods>

          <QRPlaceholder style={{ marginTop: '2rem' }}>
            <QRText>💡 Sau khi chuyển khoản thành công, click nút bên dưới để cập nhật số lượt donate!</QRText>
            <HighlightText>⚡ Tôi sẽ sao kê đầy đủ mọi khoản nhận được! ⚡</HighlightText>
          </QRPlaceholder>
          
          <DonateButton onClick={handleDonate}>
            ✅ Đã Donate! ({donates} lượt)
          </DonateButton>
          
          <GiftBox style={{ marginTop: '2rem' }}>
            <h3>🎁 CẢM ƠN BẠN ĐÃ NUÔI TÔI!</h3>
            <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
              Mỗi đồng tiền bạn gửi sẽ được sao kê minh bạch và chi tiết nhất! 💯
            </p>
          </GiftBox>
        </DonateSection>

        <Section>
          <SectionTitle>📈 Tôi Sẽ Dùng Tiền Vào Đâu?</SectionTitle>
          <BudgetList>
            <BudgetItem>
              <BudgetPercent>40%</BudgetPercent>
              <BudgetDesc>Ăn uống (Cơm, mì tôm, trứng, rau, beer, cafe. Tất cả đều sao kê đầy đủ! KHÔNG có tôm hùm!)</BudgetDesc>
            </BudgetItem>
            <BudgetItem>
              <BudgetPercent>20%</BudgetPercent>
              <BudgetDesc>Điện nước internet (Để sao kê cho anh chị)</BudgetDesc>
            </BudgetItem>
            <BudgetItem>
              <BudgetPercent>15%</BudgetPercent>
              <BudgetDesc>Thuê nhà (Phòng trọ 15m², không phải penthouse)</BudgetDesc>
            </BudgetItem>
            <BudgetItem>
              <BudgetPercent>10%</BudgetPercent>
              <BudgetDesc>Y tế (Thuốc cảm, vitamin C, khẩu trang)</BudgetDesc>
            </BudgetItem>
            <BudgetItem>
              <BudgetPercent>10%</BudgetPercent>
              <BudgetDesc>Học tập nâng cao (Sách, khóa học online để sao kê tốt hơn)</BudgetDesc>
            </BudgetItem>
            <BudgetItem>
              <BudgetPercent>5%</BudgetPercent>
              <BudgetDesc>Giải trí (Netflix? Không! Chỉ Youtube miễn phí thôi!)</BudgetDesc>
            </BudgetItem>
          </BudgetList>
          <BudgetNote>📊 Biểu đồ chi tiết cập nhật hàng tuần trên website!</BudgetNote>
        </Section>

        <Section>
          <SectionTitle>🎤 Lời Nhắn Từ Trái Tim</SectionTitle>
          <MessageContent>
            <p>
              Trong thời đại mà <strong>"từ thiện"</strong> đã trở thành từ nhạy cảm, Tôi xin khẳng định: <strong>HÃY NUÔI TÔI!</strong>
            </p>
            <p>
              Tôi nghèo, tôi cần tiền, nhưng tôi KHÔNG MẤT LƯƠNG TÂM! Mỗi đồng tiền các bạn gửi, tôi sẽ chi tiêu rõ ràng, minh bạch như bụng đói của tôi vậy! 😭
            </p>
            <p>
              Đi uống beer với bạn? <strong>Sao kê!</strong> Cafe làm việc? <strong>Sao kê!</strong> Mua đồ ăn vặt? <strong>Sao kê!</strong> Không có gì bị che giấu, tất cả đều minh bạch 100%! 🍺☕
            </p>
            <PSBox>
              <em>P/S: Tôi hứa sẽ không mua xe hơi bằng tiền donate. Vì... tôi chưa có bằng lái! 🚗❌</em>
            </PSBox>
          </MessageContent>
        </Section>

        <StatsSection>
          <SectionTitle>📊 Thống Kê</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>{likes}</StatNumber>
              <StatLabel>❤️ Lượt Like</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{donates}</StatNumber>
              <StatLabel>💳 Lượt Donate</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsSection>
        <CharityWarning>
          <CharityTitle>⚠️ LƯU Ý QUAN TRỌNG ⚠️</CharityTitle>
          <CharityText>
            <strong>Nội dung trên là đùa vui thôi!</strong>
            <br />
            Còn việc từ thiện đừng tin mấy thầy online, hãy gửi trực tiếp tới <strong>Mặt trận Tổ quốc</strong>!
          </CharityText>
          
          <CharityAccounts>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', color: '#2d3748' }}>
              🏦 Tài khoản ủng hộ chính thức - Ban Vận động cứu trợ Trung ương
            </h3>
            
            <CharityAccountItem>
              <CharityBankName>1. Ngân hàng TMCP Công Thương Việt Nam (VietinBank)</CharityBankName>
              <CharityAccountInfo>
                <div><strong>Tên tài khoản:</strong> Ban Vận động cứu trợ Trung ương</div>
                <div><strong>Số tài khoản:</strong> 55102025</div>
                <div><strong>Chi nhánh:</strong> Ngân hàng TMCP Công thương Việt Nam - Chi nhánh Đông Hà Nội</div>
              </CharityAccountInfo>
              <CopyButton onClick={() => copyToClipboard('55102025', 'Số tài khoản VietinBank')} style={{ marginTop: '1rem' }}>
                📋 Copy số TK
              </CopyButton>
            </CharityAccountItem>

            <CharityAccountItem>
              <CharityBankName>2. Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)</CharityBankName>
              <CharityAccountInfo>
                <div><strong>Tên tài khoản:</strong> Ủy ban Trung Ương MTTQ Việt Nam – Ban Vận động cứu trợ Trung ương</div>
                <div><strong>Số tài khoản:</strong> 8639699999</div>
                <div><strong>Chi nhánh:</strong> Ngân hàng TMCP Đầu tư và Phát triển Việt Nam – Chi nhánh Thăng Long</div>
              </CharityAccountInfo>
              <CopyButton onClick={() => copyToClipboard('8639699999', 'Số tài khoản BIDV')} style={{ marginTop: '1rem' }}>
                📋 Copy số TK
              </CopyButton>
            </CharityAccountItem>

            <CharityAccountItem>
              <CharityBankName>3. Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)</CharityBankName>
              <CharityAccountInfo>
                <div><strong>Tên tài khoản:</strong> Ban vận động cứu trợ Trung Ương</div>
                <div><strong>Số tài khoản:</strong> 1400666102025</div>
                <div><strong>Chi nhánh:</strong> Ngân hàng Nông nghiệp và Phát triển Nông thôn - Chi nhánh Láng Hạ</div>
              </CharityAccountInfo>
              <CopyButton onClick={() => copyToClipboard('1400666102025', 'Số tài khoản Agribank')} style={{ marginTop: '1rem' }}>
                📋 Copy số TK
              </CopyButton>
            </CharityAccountItem>

            <CharityAccountItem>
              <CharityBankName>4. Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)</CharityBankName>
              <CharityAccountInfo>
                <div><strong>Tên tài khoản:</strong> Mặt trận Tổ quốc Việt Nam-Ban cứu trợ Trung ương</div>
                <div><strong>Số tài khoản:</strong> 8888881010</div>
                <div><strong>Chi nhánh:</strong> Ngân hàng TMCP Ngoại thương Việt Nam – Chi nhánh Sở giao dịch</div>
              </CharityAccountInfo>
              <CopyButton onClick={() => copyToClipboard('8888881010', 'Số tài khoản Vietcombank')} style={{ marginTop: '1rem' }}>
                📋 Copy số TK
              </CopyButton>
            </CharityAccountItem>

            <CharityAccountItem>
              <CharityBankName>5. Ngân hàng TMCP Quân đội (MBBank)</CharityBankName>
              <CharityAccountInfo>
                <div><strong>Tên tài khoản:</strong> Mặt trận Tổ quốc Việt Nam-Ban cứu trợ Trung ương</div>
                <div><strong>Số tài khoản:</strong> 0606</div>
              </CharityAccountInfo>
              <CopyButton onClick={() => copyToClipboard('0606', 'Số tài khoản MBBank')} style={{ marginTop: '1rem' }}>
                📋 Copy số TK
              </CopyButton>
            </CharityAccountItem>
          </CharityAccounts>

          <HospitalInfo>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', color: '#2d3748' }}>
              🏥 Liên hệ trực tiếp các bệnh viện để ủng hộ các em bệnh nhỏ có hoàn cảnh khó khăn
            </h3>
            
            <HospitalItem>
              <HospitalName>1. Phòng Công tác xã hội - Bệnh viện Nhi Trung ương</HospitalName>
              <HospitalDetails>
                <div><strong>Địa chỉ:</strong> Số 18, Ngõ 879 đường La Thành, phường Láng, Hà Nội</div>
                <div><strong>Điện thoại:</strong> (024) 6273 8774</div>
                <div><strong>Email:</strong> p.ctxh@nch.org.vn</div>
                <div><strong>Website:</strong> benhviennhitrunguong.gov.vn</div>
                <div style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                  Nơi có rất nhiều em bệnh nhỏ có hoàn cảnh khó khăn cần giúp đỡ. Bạn có thể liên hệ trực tiếp để ủng hộ các em.
                </div>
              </HospitalDetails>
            </HospitalItem>

            <HospitalItem>
              <HospitalName>2. Phòng Công tác xã hội - Viện Huyết học - Truyền máu Trung ương</HospitalName>
              <HospitalDetails>
                <div><strong>Đơn vị:</strong> Phòng Công tác xã hội (trực thuộc Viện Huyết học - Truyền máu Trung ương)</div>
                <div><strong>Địa chỉ:</strong> Phòng 907, tầng 9, Tòa nhà H, Viện Huyết học - Truyền máu Trung ương, phố Phạm Văn Bạch, Yên Hòa, Cầu Giấy, Hà Nội</div>
                <div><strong>Điện thoại:</strong> (024) 3833 0088</div>
                <div><strong>Email:</strong> ctxhvhh@gmail.com</div>
                <div style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                  Nơi điều trị và chăm sóc nhiều bệnh nhân nhỏ tuổi mắc các bệnh về máu, có hoàn cảnh khó khăn cần sự hỗ trợ từ cộng đồng. Bạn có thể liên hệ trực tiếp để được hướng dẫn cách ủng hộ.
                </div>
              </HospitalDetails>
            </HospitalItem>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px', textAlign: 'center' }}>
              <strong style={{ color: '#667eea' }}>💡 Bạn có thể liên hệ trực tiếp các bệnh viện trên để được hướng dẫn cách ủng hộ cụ thể</strong>
            </div>
          </HospitalInfo>
        </CharityWarning>
        <Disclaimer>
          <p>
            <strong>⚠️ DISCLAIMER:</strong> Đây là trang web mang tính chất <strong>HÀI HƯỚC</strong> Mọi nội dung đều mang tính giải trí, không nhằm mục đích xúc phạm hay chỉ trích bất kỳ cá nhân/tổ chức nào. Còn việc từ thiện đừng tin mấy thầy online, hãy gửi trực tiếp tới Mặt trận Tổ quốc!
          </p>
        </Disclaimer>
      </MainContent>
    </AppContainer>
  );
}

export default App;
