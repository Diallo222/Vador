import {
    EffectComposer,
    DepthOfField,
    Bloom,
    Noise,
    Vignette,
    Glitch,
    DotScreen,
    ChromaticAberration
  } from "@react-three/postprocessing";
  import { GlitchMode , BlendFunction } from 'postprocessing'

  const Effects = ()=> {
    return(
        <>
        <EffectComposer multisampling={0} disableNormalPass={true}>
{/* <DepthOfField
  focusDistance={0}
  focalLength={0.02}
  bokehScale={2}
  height={480}
/> */}
{/* <Bloom
  luminanceThreshold={0}
  luminanceSmoothing={0.9}
  height={300}
  opacity={3}
/> */}
{/* <Noise opacity={0.02} /> */}

  <ChromaticAberration
    blendFunction={BlendFunction.NORMAL} // blend mode
    offset={[0.001, 0.001]} // color offset
  />
<Vignette eskil={false} offset={0.01} darkness={0.8} />
</EffectComposer>
</>
    )
  }
export default Effects