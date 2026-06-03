import React from 'react';
import { fmt2, fmt3 } from '../../rsWall/rsWallFormatters';
import {
  TableWrapper,
  DataTable,
  StatusBadge,
  ForceDetails,
  ForceDetailsSummary,
  ForceDetailsList,
} from '../../pages/RsWallDesign.styles';

function StatusCell({ status }) {
  if (status === 'SAFE') {
    return <StatusBadge $variant="safe">SAFE</StatusBadge>;
  }
  if (status === 'DESIGN NOT ACHIEVABLE') {
    return <StatusBadge $variant="fail">DESIGN NOT ACHIEVABLE</StatusBadge>;
  }
  return <StatusBadge $variant="warn">{status}</StatusBadge>;
}

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

function LayerwiseStabilityTable({ rows, loadCombination, designState }) {
  return (
    <TableWrapper>
      <DataTable $wide>
        <caption>
          External stability — layerwise table (Load combination {loadCombination}, {designState})
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
            <th>Check for Eccentricity (e/L ≤ 1/6)</th>
            <th>Mr/Mo</th>
            <th>Check for Overturning (Mr/Mo ≥ 1.5)</th>
            <th>Rv tanφ / fs Rh</th>
            <th>Check for Internal Sliding FOS (≥ 1.2)</th>
            <th>Initial L (m)</th>
            <th>Final L after iteration (m)</th>
            <th>Governing check</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
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
                <StatusCell status={row.eccentricityStatus} />
              </td>
              <td>{fmt3(row.mrMo)}</td>
              <td>
                <StatusCell status={row.overturningStatus} />
              </td>
              <td>{fmt3(row.slidingFos)}</td>
              <td>
                <StatusCell status={row.slidingStatus} />
              </td>
              <td>{fmt2(row.initialL)}</td>
              <td>{fmt2(row.finalL)}</td>
              <td>{row.governingCheck}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </TableWrapper>
  );
}

export default LayerwiseStabilityTable;
