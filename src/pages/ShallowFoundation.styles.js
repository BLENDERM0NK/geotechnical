import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  padding: clamp(1.5rem, 5vw, 4rem);
  background: radial-gradient(circle at top left, rgba(79, 70, 229, 0.15), transparent 55%),
    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.18), transparent 45%),
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
  max-width: 700px;
  line-height: 1.6;
  color: #475569;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
`;

export const FormCard = styled.div`
  background: #f8fafc;
  border-radius: 24px;
  padding: 1.25rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
  gap: 0.35rem;
`;

export const Input = styled.input`
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  padding: 0.6rem 0.85rem;
  font-size: 1rem;
  background: #fff;
`;

export const Select = styled.select`
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.7);
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

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
`;

export const MetricCard = styled.div`
  border-radius: 20px;
  padding: 1rem;
  background: linear-gradient(140deg, rgba(59, 130, 246, 0.08), rgba(14, 165, 233, 0.12));
  border: 1px solid rgba(148, 163, 184, 0.35);

  span {
    font-size: 0.9rem;
    color: #475569;
  }

  h3 {
    margin: 0.45rem 0 0;
    font-size: 1.75rem;
    color: #0f172a;
  }
`;

export const ResultPanel = styled.div`
  border-radius: 28px;
  padding: 1.5rem;
  background: #0f172a;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ResultHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: baseline;

  h2 {
    margin: 0;
    font-size: 2rem;
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.8);
  }
`;

export const BreakdownList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;

  li {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(148, 163, 184, 0.3);
    border-radius: 20px;
    padding: 0.9rem 1rem;

    h4 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
      color: #e0e7ff;
    }

    span {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }
`;

export const ErrorBanner = styled.div`
  border-radius: 16px;
  padding: 0.85rem 1rem;
  background: rgba(248, 113, 113, 0.15);
  color: #b91c1c;
  font-weight: 600;
`;

