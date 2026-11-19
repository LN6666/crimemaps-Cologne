import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

const path=new URL('../src/painted/root500/safety/owner-display-budget.ts',import.meta.url);
const js=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {fitOwnerDisplayBudget}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
function draw(city,original,delta) {
  const vertices=original+delta,indices=135579;
  const rows=[{city,batches:[{positions:{length:vertices*3},indices:{length:indices}}]}];
  return fitOwnerDisplayBudget(rows,100000,{vertices,indices,originalSourceVertices:original,
    originalSourceIndices:42843,ownerDeltaVertices:delta,ownerDeltaIndices:92736,protected:()=>true,batchIncluded:()=>true});
}
test('the Cologne mobile street view uses spare native slots while keeping the total GPU cap',()=>{
  const result=draw('cologne',28901,108326);
  assert.equal(result.vertices,137227);
  assert.equal(result.diagnostic.hardVertexCap,200000);
  assert.ok(result.diagnostic.vertexCap<=result.diagnostic.hardVertexCap);
  assert.equal(result.diagnostic.retiredOrdinaryComponents,0);
});
test('the Cologne exception is bounded by its observed expansion and spare physical slots',()=>{
  assert.throws(()=>draw('cologne',28901,108327),/finite owner allowance/);
  assert.throws(()=>draw('cologne',95000,106000),/finite owner allowance/);
  assert.throws(()=>draw('berlin',28901,108326),/finite owner allowance/);
});
