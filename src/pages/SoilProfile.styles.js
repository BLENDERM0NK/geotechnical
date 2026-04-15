import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  padding: clamp(1.5rem, 5vw, 4rem);
  background: radial-gradient(circle at top left, rgba(234, 179, 8, 0.15), transparent 55%),
    radial-gradient(circle at 80% 10%, rgba(59, 130, 246, 0.2), transparent 45%),
    #0f172a;
`;

export const Canvas = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 32px;
  padding: clamp(1.5rem, 3vw, 3rem);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.header`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.75rem);
  color: #0f172a;
`;

export const Subtitle = styled.p`
  margin: 0 auto;
  max-width: 720px;
  line-height: 1.6;
  color: #475569;
`;

export const FormCard = styled.section`
  background: #f8fafc;
  border-radius: 28px;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const LayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
`;

export const Input = styled.input`
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.65);
  padding: 0.6rem 0.85rem;
  font-size: 1rem;
  background: #fff;
`;

export const Select = styled.select`
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.65);
  padding: 0.6rem 0.85rem;
  font-size: 1rem;
  background: #fff;
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
`;

export const PrimaryButton = styled.button`
  padding: 0.65rem 1.75rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(120deg, #2563eb, #7c3aed);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 15px 30px rgba(79, 70, 229, 0.25);
`;

export const SecondaryButton = styled.button`
  padding: 0.65rem 1.75rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.2);
  background: transparent;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
`;

export const LayerList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

export const LayerChip = styled.div`
  border-radius: 18px;
  padding: 0.85rem;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(148, 163, 184, 0.4);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.95rem;
  color: #0f172a;
`;

export const CanvasPanel = styled.section`
  background: #0f172a;
  border-radius: 28px;
  padding: clamp(1.25rem, 3vw, 2.25rem);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const CanvasHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

export const CanvasWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;

  &::before {
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 4px;
    background: ${({ color }) => color};
    border: 1px solid rgba(255, 255, 255, 0.4);
  }
`;

export const ErrorBanner = styled.div`
  border-radius: 16px;
  padding: 0.85rem 1rem;
  background: rgba(248, 113, 113, 0.15);
  color: #fecaca;
  font-weight: 600;
`;

