import ScrollVideoAdaptive from "./Scrollvideoadaptive";
import ScrollVideoAuto from "./Scrollvideoauto";
import ScrollVideoCustom from "./Scrollvideocustom";
import ScrollVideoFullPage from "./Scrollvideofullpage";
import ScrollVideoLenis from "./Scrollvideolenis";

import ScrollVideoSmoothed from "./Scrollvideosmoothed";


export const metadata = {
  title: 'Scroll Video',
};

export default function Page() {
  return (
    // <ScrollVideoAdaptive />
    <ScrollVideoSmoothed />

  );
}