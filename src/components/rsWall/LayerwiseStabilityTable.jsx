import React, { useMemo, useState } from 'react';
import { fmt2, fmt3 } from '../../rsWall/rsWallFormatters';
import {
  buildDesignSummary,
  formatCheckResult,
  formatGoverningCheck,
} from '../../rsWall/rsWallResultsSummary';
import {
  DesignSummaryCard,
  SummaryGrid,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  SummaryTableWrapper,
  SummaryDataTable,
  CheckBadge,
  ResultsActions,
  ToggleDetailsButton,
  DetailsAccordion,
  DetailsAccordionHeader,
  DetailsAccordionBody,
  TableWrapper,
  DataTable,
  ForceDetails,
  ForceDetailsSummary,
  ForceDetailsList,
} from '../../pages/RsWallDesign.styles';

function VerticalForceBreakdown({ breakdown }) {
  const { V1, V2, V3, V4, vLabels } = breakdown;
  return (
    <ForceDetails>
      <ForceDetailsSummary>View components</ForceDetailsSummary>
      <ForceDetailsList>
        <li>
          V1 — {vLabels.V1}: {fmt2(V1)} kN/m
        </li>
        <li>
          V2 — {vLabels.V2}: {fmt2(V2)} kN/m
        </li>
        <li>
          V3 — {vLabels.V3}: {fmt2(V3)} kN/m
        </li>
        <li>
          V4 — {vLabels.V4}: {fmt2(V4)} kN/m
        </li>
      </ForceDetailsList>
    </ForceDetails>
  );
}

function HorizontalForceBreakdown({ breakdown }) {
  const { H1, H2, H3, hLabels } = breakdown;
  return (
    <ForceDetails>
      <ForceDetailsSummary>View components</ForceDetailsSummary>
      <ForceDetailsList>
        <li>
          H1 — {hLabels.H1}: {fmt2(H1)} kN/m
        </li>
        <li>
          H2 — {hLabels.H2}: {fmt2(H2)} kN/m
        </li>
        <li>
          H3 — {hLabels.H3}: {fmt2(H3)} kN/m
        </li>
      </ForceDetailsList>
    </ForceDetails>
  );
}

function CheckCell({ safeAtL }) {
  const { label, variant } = formatCheckResult(safeAtL);
  return <CheckBadge $variant={variant}>{label}</CheckBadge>;
}

function DesignSummary({ summary }) {
  if (!summary) return null;

  const isSafe = summary.designStatus === 'SAFE';

  return (
    <DesignSummaryCard $safe={isSafe}>
      <SummaryGrid>
        <SummaryItem>
          <SummaryLabel>Design status</SummaryLabel>
          <SummaryValue $highlight={!isSafe}>{summary.designStatus}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Controlling layer</SummaryLabel>
          <SummaryValue>{summary.controllingLayer}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Governing check</SummaryLabel>
          <SummaryValue>{summary.governingCheck}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Maximum required reinforcement length</SummaryLabel>
          <SummaryValue>{fmt2(summary.maxRequiredL)} m</SummaryValue>
        </SummaryItem>
      </SummaryGrid>
    </DesignSummaryCard>
  );
}

function CompactSummaryTable({ rows }) {
  return (
    <SummaryTableWrapper>
      <SummaryDataTable>
        <caption>External stability — engineering summary</caption>
        <thead>
          <tr>
            <th>Layer from bottom</th>
            <th>Zj (m)</th>
            <th>hj (m)</th>
            <th>Svj (m)</th>
            <th>L (m)</th>
            <th>Check for eccentricity</th>
            <th>Check for overturning</th>
            <th>Check for sliding</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.layerFromBottom}>
              <td>{row.layerFromBottom}</td>
              <td>{fmt2(row.zj)}</td>
              <td>{fmt2(row.hj)}</td>
              <td>{fmt2(row.svj)}</td>
              <td>{fmt2(row.finalL)}</td>
              <td>
                <CheckCell safeAtL={row.eccentricitySafeAtL} />
              </td>
              <td>
                <CheckCell safeAtL={row.overturningSafeAtL} />
              </td>
              <td>
                <CheckCell safeAtL={row.slidingSafeAtL} />
              </td>
            </tr>
          ))}
        </tbody>
      </SummaryDataTable>
    </SummaryTableWrapper>
  );
}

function DetailedCalculationTable({ rows, loadCombination, designState }) {
  return (
    <TableWrapper>
      <DataTable $wide $stickyHeader>
        <caption>
          Full calculation detail (Load combination {loadCombination}, {designState})
        </caption>
        <thead>
          <tr>
            <th>Layer from bottom</th>
            <th>Zj (m)</th>
            <th>hj (m)</th>
            <th>Svj (m)</th>
            <th>L (m)</th>
            <th>Rvj (kN/m)</th>
            <th>Rhj (kN/m)</th>
            <th>Mr (kN-m/m)</th>
            <th>Mo (kN-m/m)</th>
            <th>e (m)</th>
            <th>e/L</th>
            <th>Eccentricity check</th>
            <th>Mr/Mo</th>
            <th>Overturning check</th>
            <th>Sliding FOS</th>
            <th>Sliding check</th>
            <th>Initial L (m)</th>
            <th>Final L after iteration (m)</th>
            <th>Governing check</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const eccCheck = formatCheckResult(row.eccentricitySafeAtL);
            const otCheck = formatCheckResult(row.overturningSafeAtL);
            const slideCheck = formatCheckResult(row.slidingSafeAtL);

            return (
              <tr key={row.layerFromBottom}>
                <td>{row.layerFromBottom}</td>
                <td>{fmt2(row.zj)}</td>
                <td>{fmt2(row.hj)}</td>
                <td>{fmt2(row.svj)}</td>
                <td>{fmt2(row.L)}</td>
                <td>
                  {fmt2(row.Rvj)}
                  <VerticalForceBreakdown breakdown={row.forceBreakdown} />
                </td>
                <td>
                  {fmt2(row.Rhj)}
                  <HorizontalForceBreakdown breakdown={row.forceBreakdown} />
                </td>
                <td>{fmt2(row.Mr)}</td>
                <td>{fmt2(row.Mo)}</td>
                <td>{fmt2(row.e)}</td>
                <td>{fmt3(row.eOverL)}</td>
                <td>
                  <CheckBadge $variant={eccCheck.variant}>{eccCheck.label}</CheckBadge>
                </td>
                <td>{fmt3(row.mrMo)}</td>
                <td>
                  <CheckBadge $variant={otCheck.variant}>{otCheck.label}</CheckBadge>
                </td>
                <td>{fmt3(row.slidingFos)}</td>
                <td>
                  <CheckBadge $variant={slideCheck.variant}>{slideCheck.label}</CheckBadge>
                </td>
                <td>{fmt2(row.initialL)}</td>
                <td>{fmt2(row.finalL)}</td>
                <td>{formatGoverningCheck(row.governingCheck)}</td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </TableWrapper>
  );
}

function LayerwiseStabilityTable({ rows, loadCombination, designState }) {
  const [showDetails, setShowDetails] = useState(false);
  const summary = useMemo(() => buildDesignSummary(rows), [rows]);

  return (
    <>
      <DesignSummary summary={summary} />
      <CompactSummaryTable rows={rows} />
      <ResultsActions>
        <ToggleDetailsButton type="button" onClick={() => setShowDetails((open) => !open)}>
          {showDetails ? 'Hide All Calculations' : 'Show All Calculations'}
        </ToggleDetailsButton>
      </ResultsActions>
      {showDetails && (
        <DetailsAccordion>
          <DetailsAccordionHeader>Detailed layerwise calculations</DetailsAccordionHeader>
          <DetailsAccordionBody>
            <DetailedCalculationTable
              rows={rows}
              loadCombination={loadCombination}
              designState={designState}
            />
          </DetailsAccordionBody>
        </DetailsAccordion>
      )}
    </>
  );
}

export default LayerwiseStabilityTable;
