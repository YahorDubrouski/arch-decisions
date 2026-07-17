import {lazy, Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import {PageFallback} from './PageFallback';

const HomePage = lazy(() =>
    import('@/pages/HomePage').then((module) => ({default: module.HomePage}))
);
const ContextBuilderPage = lazy(() =>
    import('@/pages/ContextBuilderPage').then((module) => ({default: module.ContextBuilderPage}))
);
const RecommendationsPage = lazy(() =>
    import('@/pages/RecommendationsPage').then((module) => ({default: module.RecommendationsPage}))
);
const ArchitectureDecisionsPage = lazy(() =>
    import('@/pages/ArchitectureDecisionsPage').then((module) => ({
        default: module.ArchitectureDecisionsPage,
    }))
);
const ArchitectureDecisionPage = lazy(() =>
    import('@/pages/ArchitectureDecisionPage').then((module) => ({
        default: module.ArchitectureDecisionPage,
    }))
);

export function AppRoutes() {
    return (
        <Suspense fallback={<PageFallback/>}>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/context" element={<ContextBuilderPage/>}/>
                <Route path="/recommendations" element={<RecommendationsPage/>}/>
                <Route path="/architecture-decisions" element={<ArchitectureDecisionsPage/>}/>
                <Route path="/architecture-decisions/:decisionId" element={<ArchitectureDecisionPage/>}/>
            </Routes>
        </Suspense>
    );
}
