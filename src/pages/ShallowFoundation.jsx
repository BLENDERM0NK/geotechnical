import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Page,
  Canvas,
  Header,
  Title,
  Subtitle,
  FormGrid,
  FormCard,
  Label,
  Input,
  Select,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  MetricsGrid,
  MetricCard,
  ResultPanel,
  ResultHeader,
  BreakdownList,
  ErrorBanner,
} from './ShallowFoundation.styles';

const bearingFactors = [
  { phi: 0, Nc: 5.7, Nq: 1, Ng: 0 },
  { phi: 5, Nc: 6.5, Nq: 1.6, Ng: 0.5 },
  { phi: 10, Nc: 7.5, Nq: 2.5, Ng: 1.2 },
  { phi: 15, Nc: 9.7, Nq: 3.9, Ng: 2.7 },
  { phi: 20, Nc: 12.9, Nq: 6.4, Ng: 5.4 },
  { phi: 25, Nc: 17.7, Nq: 10.6, Ng: 10.4 },
  { phi: 30, Nc: 25.1, Nq: 18.4, Ng: 19.7 },
  { phi: 35, Nc: 37.2, Nq: 34.8, Ng: 41.4 },
  { phi: 40, Nc: 57.8, Nq: 64.2, Ng: 92.0 },
];

const interpolateFactors = (phi) => {
  if (phi <= bearingFactors[0].phi) return bearingFactors[0];
  if (phi >= bearingFactors[bearingFactors.length - 1].phi) return bearingFactors[bearingFactors.length - 1];

  for (let i = 0; i < bearingFactors.length - 1; i++) {
    const current = bearingFactors[i];
    const next = bearingFactors[i + 1];
    if (phi >= current.phi && phi <= next.phi) {
      const ratio = (phi - current.phi) / (next.phi - current.phi);
      return {
        phi,
        Nc: +(current.Nc + ratio * (next.Nc - current.Nc)).toFixed(2),
        Nq: +(current.Nq + ratio * (next.Nq - current.Nq)).toFixed(2),
        Ng: +(current.Ng + ratio * (next.Ng - current.Ng)).toFixed(2),
      };
    }
  }
  return bearingFactors[0];
};

const initialInputs = {
  width: '',
  length: '',
  depth: '',
  unitWeight: '',
  cohesion: '',
  phi: '',
  surcharge: '',
  fs: 3,
};

function ShallowFoundation() {
  const [inputs, setInputs] = useState(initialInputs);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setInputs(initialInputs);
    setResults(null);
    setError('');
  };

  const validate = () => {
    const required = ['width', 'length', 'depth', 'unitWeight', 'cohesion', 'phi'];
    for (const key of required) {
      if (!inputs[key]) {
        setError('Please fill in all required fields.');
        return false;
      }
    }
    return true;
  };

  const handleCalculate = () => {
    if (!validate()) return;

    const B = parseFloat(inputs.width);
    const L = parseFloat(inputs.length);
    const Df = parseFloat(inputs.depth);
    const gamma = parseFloat(inputs.unitWeight);
    const c = parseFloat(inputs.cohesion);
    const phi = parseFloat(inputs.phi);
    const surcharge = parseFloat(inputs.surcharge || 0);
    const fs = parseFloat(inputs.fs || 3);

    if (B <= 0 || L <= 0 || Df <= 0 || gamma <= 0 || fs <= 0) {
      setError('Dimensions, unit weight, and factor of safety must be positive.');
      return;
    }

    const { Nc, Nq, Ng } = interpolateFactors(phi);
    const q = gamma * Df + surcharge;
    const shapeRatio = Math.min(B / L || 1, 1);
    const sc = 1 + 0.2 * shapeRatio;
    const sq = 1 + 0.1 * shapeRatio;
    const sγ = Math.max(0.6, 1 - 0.4 * shapeRatio);

    const cohesionTerm = c * Nc * sc;
    const surchargeTerm = q * Nq * sq;
    const unitWeightTerm = 0.5 * gamma * B * Ng * sγ;

    const qu = cohesionTerm + surchargeTerm + unitWeightTerm;
    const qa = qu / fs;

    setResults({
      ultimate: +qu.toFixed(2),
      allowable: +qa.toFixed(2),
      cohesionTerm: +cohesionTerm.toFixed(2),
      surchargeTerm: +surchargeTerm.toFixed(2),
      unitWeightTerm: +unitWeightTerm.toFixed(2),
      factors: { Nc, Nq, Ng, sc: +sc.toFixed(2), sq: +sq.toFixed(2), sγ: +sγ.toFixed(2) },
    });
    setError('');
  };

  return (
    <>
      <Navbar />
      <Page>
        <Canvas>
          <Header>
            <Title>Shallow Foundation Capacity</Title>
            <Subtitle>
              Estimate ultimate and allowable bearing capacity for isolated or strip footings using Terzaghi&apos;s formulation with interpolated bearing factors.
            </Subtitle>
          </Header>

          <FormGrid>
            <FormCard>
              <h3>Geometry</h3>
              <Label>
                Width B (m)
                <Input name="width" type="number" value={inputs.width} onChange={handleChange} placeholder="e.g. 1.2" />
              </Label>
              <Label>
                Length L (m)
                <Input name="length" type="number" value={inputs.length} onChange={handleChange} placeholder="e.g. 1.8" />
              </Label>
              <Label>
                Embedment depth Df (m)
                <Input name="depth" type="number" value={inputs.depth} onChange={handleChange} placeholder="e.g. 1.5" />
              </Label>
            </FormCard>

            <FormCard>
              <h3>Soil parameters</h3>
              <Label>
                Unit weight γ (kN/m³)
                <Input name="unitWeight" type="number" value={inputs.unitWeight} onChange={handleChange} placeholder="e.g. 18" />
              </Label>
              <Label>
                Cohesion c (kPa)
                <Input name="cohesion" type="number" value={inputs.cohesion} onChange={handleChange} placeholder="e.g. 25" />
              </Label>
              <Label>
                Friction angle ϕ (°)
                <Input name="phi" type="number" value={inputs.phi} onChange={handleChange} placeholder="e.g. 28" />
              </Label>
            </FormCard>

            <FormCard>
              <h3>Design settings</h3>
              <Label>
                Surcharge (kPa)
                <Input name="surcharge" type="number" value={inputs.surcharge} onChange={handleChange} placeholder="optional" />
              </Label>
              <Label>
                Factor of safety
                <Select name="fs" value={inputs.fs} onChange={handleChange}>
                  {[2, 2.5, 3, 3.5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </Label>
              <small style={{ color: '#475569' }}>Shape factors adjust automatically using B / L.</small>
            </FormCard>
          </FormGrid>

          {error && <ErrorBanner>{error}</ErrorBanner>}

          <ButtonRow>
            <PrimaryButton type="button" onClick={handleCalculate}>
              Calculate capacity
            </PrimaryButton>
            <SecondaryButton type="button" onClick={resetForm}>
              Reset
            </SecondaryButton>
          </ButtonRow>

          {results && (
            <>
              <MetricsGrid>
                <MetricCard>
                  <span>Ultimate bearing capacity</span>
                  <h3>{results.ultimate} kPa</h3>
                </MetricCard>
                <MetricCard>
                  <span>Allowable bearing capacity</span>
                  <h3>{results.allowable} kPa</h3>
                </MetricCard>
                <MetricCard>
                  <span>Factor of safety</span>
                  <h3>× {inputs.fs}</h3>
                </MetricCard>
              </MetricsGrid>

              <ResultPanel>
                <ResultHeader>
                  <h2>Contribution breakdown</h2>
                  <p>N₍c₎, N₍q₎, N₍γ₎ interpolated for ϕ = {inputs.phi}°</p>
                </ResultHeader>
                <BreakdownList>
                  <li>
                    <h4>Cohesion term (c · Nc · sc)</h4>
                    <span>{results.cohesionTerm} kPa</span>
                  </li>
                  <li>
                    <h4>Surcharge term (q · Nq · sq)</h4>
                    <span>{results.surchargeTerm} kPa</span>
                  </li>
                  <li>
                    <h4>Unit weight term (0.5γB · Nγ · sγ)</h4>
                    <span>{results.unitWeightTerm} kPa</span>
                  </li>
                </BreakdownList>
                <BreakdownList>
                  <li>
                    <h4>Nc</h4>
                    <span>{results.factors.Nc}</span>
                  </li>
                  <li>
                    <h4>Nq</h4>
                    <span>{results.factors.Nq}</span>
                  </li>
                  <li>
                    <h4>Nγ</h4>
                    <span>{results.factors.Ng}</span>
                  </li>
                  <li>
                    <h4>Shape factors</h4>
                    <span>sc {results.factors.sc} · sq {results.factors.sq} · sγ {results.factors.sγ}</span>
                  </li>
                </BreakdownList>
              </ResultPanel>
            </>
          )}
        </Canvas>
      </Page>
    </>
  );
}

export default ShallowFoundation;

