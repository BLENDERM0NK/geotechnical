import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  padding: clamp(1.5rem, 5vw, 4rem);
  background: radial-gradient(circle at top left, rgba(234, 88, 12, 0.12), transparent 55%),
    radial-gradient(circle at 85% 15%, rgba(99, 102, 241, 0.18), transparent 45%),
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
  max-width: 760px;
  line-height: 1.6;
  color: #475569;
`;

export const SectionsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SectionCard = styled.section`
  background: #f8fafc;
  border-radius: 24px;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border: 1px solid rgba(148, 163, 184, 0.4);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionHeading = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: #0f172a;
  padding-bottom: 0.35rem;
  border-bottom: 2px solid rgba(99, 102, 241, 0.25);
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
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

  &:read-only {
    background: rgba(99, 102, 241, 0.06);
    color: #312e81;
    cursor: default;
  }
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
  align-items: center;
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

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
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

export const ErrorBanner = styled.div`
  border-radius: 16px;
  padding: 0.85rem 1rem;
  background: rgba(248, 113, 113, 0.15);
  color: #b91c1c;
  font-weight: 600;
`;

export const Hint = styled.p`
  margin: 0;
  font-size: 0.78rem;
  font-weight: 500;
  color: #64748b;
  line-height: 1.45;
`;

export const CalcPanel = styled.div`
  border-radius: 20px;
  padding: 1.25rem;
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.22);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: #fff;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
  min-width: ${({ $wide }) => ($wide ? '1800px' : '640px')};

  caption {
    caption-side: top;
    text-align: left;
    padding: 0.85rem 1rem;
    font-weight: 700;
    color: #0f172a;
    background: #f1f5f9;
    border-bottom: 1px solid rgba(148, 163, 184, 0.4);
  }

  thead th {
    background: #0f172a;
    color: #e2e8f0;
    font-weight: 600;
    padding: 0.75rem 0.85rem;
    text-align: center;
    white-space: nowrap;
  }

  tbody td {
    padding: 0.65rem 0.85rem;
    text-align: center;
    border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    color: #1e293b;
  }

  tbody tr:nth-child(even) {
    background: rgba(248, 250, 252, 0.9);
  }

  tbody tr:hover {
    background: rgba(99, 102, 241, 0.06);
  }
`;

export const SoilTableInput = styled.input`
  width: 100%;
  min-width: 4rem;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.65);
  padding: 0.45rem 0.55rem;
  font-size: 0.9rem;
  background: #fff;
  text-align: center;
`;

export const ResultMeta = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
  background: ${({ $variant }) => {
    if ($variant === 'safe') return 'rgba(34, 197, 94, 0.18)';
    if ($variant === 'fail') return 'rgba(239, 68, 68, 0.18)';
    return 'rgba(245, 158, 11, 0.18)';
  }};
  color: ${({ $variant }) => {
    if ($variant === 'safe') return '#15803d';
    if ($variant === 'fail') return '#b91c1c';
    return '#b45309';
  }};
  border: 1px solid
    ${({ $variant }) => {
      if ($variant === 'safe') return 'rgba(34, 197, 94, 0.45)';
      if ($variant === 'fail') return 'rgba(239, 68, 68, 0.45)';
      return 'rgba(245, 158, 11, 0.45)';
    }};
`;

export const ForceDetails = styled.details`
  margin-top: 0.35rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #475569;
`;

export const ForceDetailsSummary = styled.summary`
  cursor: pointer;
  color: #4338ca;
  font-weight: 600;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const ForceDetailsList = styled.ul`
  margin: 0.35rem 0 0;
  padding-left: 1rem;
  line-height: 1.5;
`;
