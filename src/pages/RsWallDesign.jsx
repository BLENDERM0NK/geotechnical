import React, { useMemo, useRef, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  SEISMIC_ZONE_DATA,
  SEISMIC_ZONE_OPTIONS,
  CONCRETE_GRADES,
  LOAD_COMBINATION_OPTIONS,
  DESIGN_STATE_OPTIONS,
} from '../rsWall/rsWallConstants';
import {
  computeMechanicalHeight,
  computeWallHeightAboveGL,
  generateLayerwiseRows,
  getActiveDesignFactors,
} from '../rsWall/rsWallCalculations';
import { computeExternalStabilityRows } from '../rsWall/rsWallExternalStability';
import LayerwiseStabilityTable from '../components/rsWall/LayerwiseStabilityTable';
import { initialRsWallState } from '../rsWall/rsWallInitialState';
import { validateRsWallInputs, validateLayerwiseSubmit } from '../rsWall/rsWallValidation';
import {
  Page,
  Canvas,
  Header,
  Title,
  Subtitle,
  SectionsStack,
  SectionCard,
  SectionHeading,
  FormGrid,
  Label,
  Input,
  Select,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  ErrorBanner,
  Hint,
  CalcPanel,
  TableWrapper,
  DataTable,
  SoilTableInput,
  ResultMeta,
} from './RsWallDesign.styles';

function RsWallDesign() {
  const [inputs, setInputs] = useState(initialRsWallState);
  const [error, setError] = useState('');
  const [showCalcWorkflow, setShowCalcWorkflow] = useState(false);
  const [loadCombination, setLoadCombination] = useState('');
  const [designState, setDesignState] = useState('');
  const [layerwiseRows, setLayerwiseRows] = useState(null);
  const [activeFactors, setActiveFactors] = useState(null);
  const calcPanelRef = useRef(null);

  const hAboveGL = useMemo(() => computeWallHeightAboveGL(inputs.H, inputs.Dm), [inputs.H, inputs.Dm]);
  const Ht = useMemo(() => computeMechanicalHeight(inputs.H, inputs.Trm), [inputs.H, inputs.Trm]);

  const seismicCoeffs = useMemo(() => {
    const zone = inputs.seismicZone;
    return SEISMIC_ZONE_DATA[zone] ?? { alpha0: null, alpham: null };
  }, [inputs.seismicZone]);

  const validationPreview = useMemo(() => validateRsWallInputs(inputs), [inputs]);

  useEffect(() => {
    if (showCalcWorkflow && calcPanelRef.current) {
      calcPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showCalcWorkflow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setError('');
    setLayerwiseRows(null);
    setActiveFactors(null);
  };

  const handleSoilChange = (index, field, value) => {
    setInputs((prev) => {
      const soilRows = prev.soilRows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      );
      return { ...prev, soilRows };
    });
    setError('');
    setLayerwiseRows(null);
    setActiveFactors(null);
  };

  const resetForm = () => {
    setInputs({
      ...initialRsWallState,
      soilRows: initialRsWallState.soilRows.map((row) => ({ ...row })),
    });
    setError('');
    setShowCalcWorkflow(false);
    setLoadCombination('');
    setDesignState('');
    setLayerwiseRows(null);
    setActiveFactors(null);
  };

  const handleStartExternalStability = () => {
    const { valid, errors } = validateRsWallInputs(inputs);
    if (!valid) {
      setError(errors.slice(0, 5).join(' '));
      setShowCalcWorkflow(false);
      return;
    }
    setError('');
    setShowCalcWorkflow(true);
    setLoadCombination('');
    setDesignState('');
    setLayerwiseRows(null);
    setActiveFactors(null);
  };

  const handleLayerwiseSubmit = () => {
    if (!loadCombination || !designState) {
      setError('Select both load combination and design state before submitting.');
      return;
    }

    const { valid, errors } = validateLayerwiseSubmit(inputs);
    if (!valid) {
      setError(errors[0]);
      return;
    }

    const factors = getActiveDesignFactors(loadCombination, designState);
    if (!factors) {
      setError('Invalid load combination or design state.');
      return;
    }

    const H = parseFloat(inputs.H);
    const Zj = parseFloat(inputs.Zj);
    const Sv = parseFloat(inputs.Sv);
    const baseRows = generateLayerwiseRows({ H, Zj, Sv });

    if (!baseRows.length) {
      setError('Could not generate reinforcement layers. Check H, Zj, and Sv.');
      return;
    }

    const enrichedRows = computeExternalStabilityRows({
      baseRows,
      loadCombination,
      designState,
      DL: parseFloat(inputs.DL) || 0,
      LL: parseFloat(inputs.LL) || 0,
      SL: parseFloat(inputs.SL) || 0,
      bf: parseFloat(inputs.bf) || 0,
      soilRows: inputs.soilRows,
    });

    setActiveFactors(factors);
    setLayerwiseRows(enrichedRows);
    setError('');
  };

  const calcSelectionsReady = Boolean(loadCombination && designState);

  return (
    <>
      <Navbar />
      <Page>
        <Canvas>
          <Header>
            <Title>RS Wall Design</Title>
            <Subtitle>
              Reinforced soil retaining wall — geometry, soil parameters, loading, seismic inputs, and
              layerwise external stability (expandable for earth pressure, pullout, sliding, and bearing checks).
            </Subtitle>
          </Header>

          <SectionsStack>
            <SectionCard>
              <SectionHeading>Section 1 — Wall geometry</SectionHeading>
              <FormGrid>
                <Label>
                  Design height of wall, H (m)
                  <Input name="H" type="number" min="0" step="any" value={inputs.H} onChange={handleChange} placeholder="e.g. 8.0" />
                </Label>
                <Label>
                  Depth of embankment, Dm (m)
                  <Input name="Dm" type="number" min="0" step="any" value={inputs.Dm} onChange={handleChange} placeholder="e.g. 1.5" />
                </Label>
                <Label>
                  Wall height above G.L, h (m)
                  <Input readOnly value={hAboveGL !== null ? hAboveGL : ''} placeholder="H − Dm" />
                </Label>
                <Label>
                  Thickness of road material, Trm (m)
                  <Input name="Trm" type="number" min="0" step="any" value={inputs.Trm} onChange={handleChange} placeholder="e.g. 0.5" />
                </Label>
                <Label>
                  Mechanical height of wall, Ht (m)
                  <Input readOnly value={Ht !== null ? Ht : ''} placeholder="H + Trm" />
                </Label>
                <Label>
                  Average unit weight of pavement, γ_rm (kN/m³)
                  <Input name="gammaRm" type="number" min="0" step="any" value={inputs.gammaRm} onChange={handleChange} placeholder="e.g. 22" />
                </Label>
              </FormGrid>
              <Hint>h = H − Dm and Ht = H + Trm (auto-calculated).</Hint>
            </SectionCard>

            <SectionCard>
              <SectionHeading>Section 2 — Wall inclination</SectionHeading>
              <FormGrid>
                <Label>
                  Measured from vertical, ω (°)
                  <Input name="omega" type="number" min="0" max="89.9" step="any" value={inputs.omega} onChange={handleChange} placeholder="e.g. 5" />
                </Label>
                <Label>
                  Measured from horizontal, α (°)
                  <Input name="alpha" type="number" min="0" max="89.9" step="any" value={inputs.alpha} onChange={handleChange} placeholder="e.g. 85" />
                </Label>
              </FormGrid>
            </SectionCard>

            <SectionCard>
              <SectionHeading>Section 3 — Slopes</SectionHeading>
              <FormGrid>
                <Label>
                  Front slope angle, i (°)
                  <Input name="frontSlope" type="number" min="0" max="89.9" step="any" value={inputs.frontSlope} onChange={handleChange} placeholder="e.g. 0" />
                </Label>
                <Label>
                  Back slope angle, β (°)
                  <Input name="backSlope" type="number" min="0" max="89.9" step="any" value={inputs.backSlope} onChange={handleChange} placeholder="e.g. 0" />
                </Label>
              </FormGrid>
            </SectionCard>

            <SectionCard>
              <SectionHeading>Section 4 — Input soil parameters (long-term stability)</SectionHeading>
              <TableWrapper>
                <DataTable>
                  <caption>Editable soil properties</caption>
                  <thead>
                    <tr>
                      <th>Soil data</th>
                      <th>C′ (kPa)</th>
                      <th>γ (kN/m³)</th>
                      <th>φ (°)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputs.soilRows.map((row, index) => (
                      <tr key={row.id}>
                        <td>
                          <SoilTableInput
                            value={row.soilData}
                            onChange={(e) => handleSoilChange(index, 'soilData', e.target.value)}
                            aria-label={`Soil data row ${index + 1}`}
                          />
                        </td>
                        <td>
                          <SoilTableInput
                            type="number"
                            min="0"
                            step="any"
                            value={row.cohesion}
                            onChange={(e) => handleSoilChange(index, 'cohesion', e.target.value)}
                            aria-label={`Cohesion row ${index + 1}`}
                          />
                        </td>
                        <td>
                          <SoilTableInput
                            type="number"
                            min="0"
                            step="any"
                            value={row.gamma}
                            onChange={(e) => handleSoilChange(index, 'gamma', e.target.value)}
                            aria-label={`Unit weight row ${index + 1}`}
                          />
                        </td>
                        <td>
                          <SoilTableInput
                            type="number"
                            min="0"
                            max="89.9"
                            step="any"
                            value={row.phi}
                            onChange={(e) => handleSoilChange(index, 'phi', e.target.value)}
                            aria-label={`Friction angle row ${index + 1}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              </TableWrapper>
            </SectionCard>

            <SectionCard>
              <SectionHeading>Section 5 — External loading</SectionHeading>
              <FormGrid>
                <Label>
                  Dead load surcharge, DL (kN/m²)
                  <Input name="DL" type="number" min="0" step="any" value={inputs.DL} onChange={handleChange} placeholder="e.g. 10" />
                </Label>
                <Label>
                  Traffic surcharge, LL (kN/m²)
                  <Input name="LL" type="number" min="0" step="any" value={inputs.LL} onChange={handleChange} placeholder="e.g. 20" />
                </Label>
                <Label>
                  Strip loading, SL (kN/m²)
                  <Input name="SL" type="number" min="0" step="any" value={inputs.SL} onChange={handleChange} placeholder="e.g. 0" />
                </Label>
                <Label>
                  Width of friction slab (for SL), bf (m)
                  <Input name="bf" type="number" min="0" step="any" value={inputs.bf} onChange={handleChange} placeholder="e.g. 2" />
                </Label>
                <Label>
                  Distance from wall edge to centre of strip load, d (m)
                  <Input name="d" type="number" min="0" step="any" value={inputs.d} onChange={handleChange} placeholder="e.g. 1.5" />
                </Label>
              </FormGrid>
            </SectionCard>

            <SectionCard>
              <SectionHeading>Section 6 — Input seismic parameters</SectionHeading>
              <FormGrid>
                <Label>
                  Seismic zone
                  <Select name="seismicZone" value={inputs.seismicZone} onChange={handleChange}>
                    {SEISMIC_ZONE_OPTIONS.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </Select>
                </Label>
                <Label>
                  Maximum ground acceleration coefficient, α₀
                  <Input
                    readOnly
                    value={seismicCoeffs.alpha0 !== null ? seismicCoeffs.alpha0 : ''}
                    placeholder="From zone"
                  />
                </Label>
                <Label>
                  Maximum wall acceleration coefficient, αₘ
                  <Input
                    readOnly
                    value={seismicCoeffs.alpham !== null ? seismicCoeffs.alpham : ''}
                    placeholder="From zone"
                  />
                </Label>
              </FormGrid>
            </SectionCard>

            <SectionCard>
              <SectionHeading>Section 7 — Facing panel details</SectionHeading>
              <FormGrid>
                <Label>
                  Height of facing panel, Hp (m)
                  <Input name="Hp" type="number" min="0" step="any" value={inputs.Hp} onChange={handleChange} placeholder="e.g. 0.5" />
                </Label>
                <Label>
                  Width of facing panel, Wp (m)
                  <Input name="Wp" type="number" min="0" step="any" value={inputs.Wp} onChange={handleChange} placeholder="e.g. 1.2" />
                </Label>
                <Label>
                  Grade of concrete
                  <Select name="concreteGrade" value={inputs.concreteGrade} onChange={handleChange}>
                    {CONCRETE_GRADES.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </Select>
                </Label>
              </FormGrid>
            </SectionCard>

            <SectionCard>
              <SectionHeading>Section 8 — Placement of reinforcement layers</SectionHeading>
              <FormGrid>
                <Label>
                  Height of first layer from top of levelling pad, Zj (m)
                  <Input name="Zj" type="number" min="0" step="any" value={inputs.Zj} onChange={handleChange} placeholder="e.g. 0.5" />
                </Label>
                <Label>
                  Vertical distance between reinforcement layers, Sv (m)
                  <Input name="Sv" type="number" min="0" step="any" value={inputs.Sv} onChange={handleChange} placeholder="e.g. 0.6" />
                </Label>
              </FormGrid>
            </SectionCard>
          </SectionsStack>

          <ButtonRow>
            <SecondaryButton type="button" onClick={resetForm}>
              Reset all inputs
            </SecondaryButton>
          </ButtonRow>

          <CalcPanel ref={calcPanelRef}>
            {error && <ErrorBanner role="alert">{error}</ErrorBanner>}
            <PrimaryButton type="button" onClick={handleStartExternalStability}>
              External Stability Calculation for RS Wall (Layerwise)
            </PrimaryButton>
            {!validationPreview.valid && (
              <Hint>
                Click the button to check inputs. Missing or invalid fields will be listed above. Soil γ and φ,
                wall geometry (H, Zj, Sv), and panel dimensions (Hp, Wp) are required; surcharges and cohesion may be 0.
              </Hint>
            )}

            {showCalcWorkflow && (
              <>
                <FormGrid>
                  <Label>
                    Load combination
                    <Select
                      value={loadCombination}
                      onChange={(e) => {
                        setLoadCombination(e.target.value);
                        setLayerwiseRows(null);
                        setActiveFactors(null);
                      }}
                    >
                      <option value="">Select…</option>
                      {LOAD_COMBINATION_OPTIONS.map((combo) => (
                        <option key={combo} value={combo}>
                          {combo}
                        </option>
                      ))}
                    </Select>
                  </Label>
                  <Label>
                    Design state
                    <Select
                      value={designState}
                      onChange={(e) => {
                        setDesignState(e.target.value);
                        setLayerwiseRows(null);
                        setActiveFactors(null);
                      }}
                    >
                      <option value="">Select…</option>
                      {DESIGN_STATE_OPTIONS.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </Select>
                  </Label>
                </FormGrid>

                {calcSelectionsReady && (
                  <ButtonRow>
                    <PrimaryButton type="button" onClick={handleLayerwiseSubmit}>
                      Submit
                    </PrimaryButton>
                  </ButtonRow>
                )}
              </>
            )}
          </CalcPanel>

          {layerwiseRows && layerwiseRows.length > 0 && (
            <SectionCard>
              <SectionHeading>Layerwise external stability</SectionHeading>
              {activeFactors && (
                <ResultMeta>
                  Load combination {loadCombination}, design state {designState} — eccentricity, overturning,
                  and sliding checks with iterative length adjustment (ΔL = 0.50 m).
                </ResultMeta>
              )}
              <LayerwiseStabilityTable
                rows={layerwiseRows}
                loadCombination={loadCombination}
                designState={designState}
              />
              <Hint>
                Column L (5) is the initial length max(0.7 × hj, 3.0 m). Columns 6–16 and final L use the
                adopted length after sequential eccentricity → overturning → sliding iteration.
              </Hint>
            </SectionCard>
          )}
        </Canvas>
      </Page>
    </>
  );
}

export default RsWallDesign;
