import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(59, 130, 246, 0.15), transparent 55%),
    radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.18), transparent 40%),
    #0f172a;
  padding: clamp(1.5rem, 4vw, 3.5rem);
  color: #0f172a;
`;

export const Canvas = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32px;
  padding: clamp(1.5rem, 3vw, 3rem);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.header`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Title = styled.h2`
  color: #0f172a;
  font-size: clamp(2rem, 4vw, 2.75rem);
  margin: 0;
`;

export const Subtitle = styled.p`
  color: #475569;
  font-size: 1.1rem;
  max-width: 760px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const TagList = styled.div`
  display: inline-flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export const Tag = styled.span`
  padding: 0.35rem 1rem;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.1);
  color: #4338ca;
  font-weight: 600;
  font-size: 0.9rem;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  gap: 1.75rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionCard = styled.section`
  background: #ffffff;
  border-radius: 28px;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const SectionTitle = styled.div`
  h3 {
    margin: 0;
    font-size: 1.35rem;
    color: #0f172a;
  }
  p {
    margin: 0.35rem 0 0;
    color: #64748b;
    font-size: 0.95rem;
  }
`;

export const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;

  label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
    color: #1f2937;
    font-size: 0.95rem;
    background: #f8fafc;
    padding: 0.85rem;
    border-radius: 18px;
    border: 1px solid rgba(148, 163, 184, 0.4);
  }

  input,
  select {
    margin-top: 0.35rem;
    padding: 0.55rem 0.75rem;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.65);
    font-size: 1rem;
    background: #fff;
  }
`;

export const StatGrid = styled.div`
  margin-top: 1.75rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

export const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(14, 165, 233, 0.12));
  border-radius: 20px;
  padding: 1.1rem;
  border: 1px solid rgba(147, 197, 253, 0.5);

  h4 {
    margin: 0 0 0.35rem;
    font-size: 1.1rem;
    color: #1d4ed8;
  }

  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }
`;

export const LayerContainer = styled.div`
  border: 1px solid rgba(148, 163, 184, 0.35);
  margin-top: 1.5rem;
  padding: 1.2rem;
  border-radius: 24px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const LayerTitle = styled.h4`
  color: #0f172a;
  margin: 0;
  font-size: 1.1rem;
`;

export const Info = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
`;

export const CalculationResult = styled.div`
  margin-top: 0.5rem;
  padding: 0.85rem;
  border-radius: 16px;
  background: ${({ type }) => (type === 'bearing' ? 'rgba(191, 219, 254, 0.8)' : 'rgba(187, 247, 208, 0.8)')};
  color: ${({ type }) => (type === 'bearing' ? '#1e3a8a' : '#166534')};
  font-size: 0.95rem;
`;

export const MaxOverburdenBox = styled.div`
  margin-top: 1.5rem;
  padding: 1.3rem;
  background: #ecfeff;
  border-radius: 24px;
  border: 1px solid #67e8f9;

  h3 {
    color: #0f172a;
    font-size: 1.15rem;
    margin-bottom: 0.35rem;
  }

  p {
    font-size: 1rem;
    margin: 0;
    color: #134e4a;
  }
`;

export const Button = styled.button`
  padding: 0.65rem 1.5rem;
  background: linear-gradient(120deg, #2563eb, #7c3aed);
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 15px 25px rgba(79, 70, 229, 0.25);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const AddLayerButton = styled(Button)`
  background: linear-gradient(120deg, #10b981, #059669);
  box-shadow: 0 15px 25px rgba(16, 185, 129, 0.25);
`;

export const EmptyState = styled.div`
  border: 1px dashed rgba(148, 163, 184, 0.8);
  padding: 2rem;
  text-align: center;
  border-radius: 24px;
  color: #475569;
  background: rgba(248, 250, 252, 0.9);
`;
