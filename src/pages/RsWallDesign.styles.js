import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  padding: clamp(1.5rem, 5vw, 4rem);
  background: radial-gradient(circle at top left, rgba(234, 88, 12, 0.12), transparent 55%),
    radial-gradient(circle at 85% 15%, rgba(99, 102, 241, 0.18), transparent 45%),
    #0f172a;
`;

export const Canvas = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 32px;
  padding: clamp(1rem, 2.5vw, 2rem);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  line-height: 1.45;
  font-size: 0.9rem;
  color: #475569;
`;

/** Two-column section layout on wide screens to reduce vertical scroll. */
export const SectionsStack = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
`;

export const SectionCard = styled.section`
  background: #f8fafc;
  border-radius: 16px;
  padding: 0.75rem 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-width: 0;

  &[data-span='full'] {
    @media (min-width: 900px) {
      grid-column: 1 / -1;
    }
  }
`;

export const SectionHeading = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  color: #0f172a;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid rgba(99, 102, 241, 0.25);
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 0.5rem 0.65rem;
  align-items: start;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.72rem;
  line-height: 1.25;
  gap: 0.2rem;
  min-width: 0;
`;

export const Input = styled.input`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  padding: 0.35rem 0.5rem;
  font-size: 0.85rem;
  background: #fff;

  &:read-only {
    background: rgba(99, 102, 241, 0.06);
    color: #312e81;
    cursor: default;
  }
`;

export const Select = styled.select`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  padding: 0.35rem 0.5rem;
  font-size: 0.85rem;
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
  font-size: 0.68rem;
  font-weight: 500;
  color: #64748b;
  line-height: 1.35;
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
  font-size: 0.8rem;
  table-layout: fixed;
  min-width: ${({ $wide }) => ($wide ? '1800px' : '0')};

  caption {
    caption-side: top;
    text-align: left;
    padding: 0.45rem 0.65rem;
    font-weight: 700;
    font-size: 0.75rem;
    color: #0f172a;
    background: #f1f5f9;
    border-bottom: 1px solid rgba(148, 163, 184, 0.4);
  }

  thead th {
    background: #0f172a;
    color: #e2e8f0;
    font-weight: 600;
    padding: 0.4rem 0.45rem;
    text-align: center;
    white-space: nowrap;
    font-size: 0.72rem;
  }

  tbody td {
    padding: 0.35rem 0.4rem;
    text-align: center;
    border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    color: #1e293b;
    overflow: hidden;
    vertical-align: middle;
  }

  tbody tr:nth-child(even) {
    background: rgba(248, 250, 252, 0.9);
  }

  tbody tr:hover {
    background: rgba(99, 102, 241, 0.06);
  }

  ${({ $stickyHeader }) =>
    $stickyHeader &&
    `
    thead th {
      position: sticky;
      top: 0;
      z-index: 2;
    }
  `}
`;

export const SoilTableInput = styled.input`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.65);
  padding: 0.3rem 0.35rem;
  font-size: 0.8rem;
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

export const DesignSummaryCard = styled.div`
  border-radius: 16px;
  padding: 1rem 1.25rem;
  border: 1px solid
    ${({ $safe }) => ($safe ? 'rgba(34, 197, 94, 0.45)' : 'rgba(239, 68, 68, 0.45)')};
  background: ${({ $safe }) =>
    $safe ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)'};
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.85rem 1.25rem;
`;

export const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const SummaryLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
`;

export const SummaryValue = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ $highlight }) => ($highlight ? '#b91c1c' : '#0f172a')};
`;

export const SummaryTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: #fff;

  @media (min-width: 900px) {
    overflow-x: visible;
  }
`;

export const SummaryDataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  table-layout: auto;

  caption {
    caption-side: top;
    text-align: left;
    padding: 0.45rem 0.65rem;
    font-weight: 700;
    font-size: 0.75rem;
    color: #0f172a;
    background: #f1f5f9;
    border-bottom: 1px solid rgba(148, 163, 184, 0.4);
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #0f172a;
    color: #e2e8f0;
    font-weight: 600;
    padding: 0.4rem 0.5rem;
    text-align: center;
    white-space: nowrap;
    font-size: 0.7rem;
  }

  tbody td {
    padding: 0.35rem 0.45rem;
    text-align: center;
    border-bottom: 1px solid rgba(148, 163, 184, 0.22);
    color: #1e293b;
    vertical-align: middle;
  }

  tbody tr:nth-child(even) {
    background: rgba(248, 250, 252, 0.95);
  }

  tbody tr:hover {
    background: rgba(99, 102, 241, 0.05);
  }
`;

export const CheckBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.35;
  white-space: normal;
  max-width: 9rem;
  background: ${({ $variant }) =>
    $variant === 'safe' ? 'rgba(34, 197, 94, 0.16)' : 'rgba(239, 68, 68, 0.16)'};
  color: ${({ $variant }) => ($variant === 'safe' ? '#15803d' : '#b91c1c')};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'safe' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'};
`;

export const ResultsActions = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 0.25rem;
`;

export const ToggleDetailsButton = styled.button`
  padding: 0.55rem 1.35rem;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.18);
  background: #fff;
  color: #0f172a;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);

  &:hover {
    background: #f8fafc;
    border-color: rgba(37, 99, 235, 0.35);
  }
`;

export const DetailsAccordion = styled.div`
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
`;

export const DetailsAccordionHeader = styled.div`
  padding: 0.55rem 0.85rem;
  background: #f1f5f9;
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
  font-size: 0.78rem;
  font-weight: 700;
  color: #334155;
`;

export const DetailsAccordionBody = styled.div`
  padding: 0.5rem;
`;
