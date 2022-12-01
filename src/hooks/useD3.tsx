import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

type Props = {
    render: (selection: any) => void;
    dependencies: any[];
}

function useD3(render:(selection: any) => void,dependencies:any[]) {
    const ref = useRef(null);

    useEffect(() => {
        render(d3.select(ref.current));
        return () => {};
    }, dependencies ? dependencies : []);

    return ref;
}

export default useD3