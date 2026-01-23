import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"),
    route("basic", "routes/basic.tsx"),
    route("scientific", "routes/scientific.tsx"),
    route("ip", "routes/ip.tsx"),
    route("financial", "routes/financial.tsx"),
] satisfies RouteConfig;
