import { forwardRef } from 'react';

const RouteWipe = forwardRef(function RouteWipe(_props, ref) {
  return (
    <div className="wipe" id="wipe" aria-hidden="true" ref={ref}>
      <i />
      <i />
      <i />
      <i />
    </div>
  );
});

export default RouteWipe;
