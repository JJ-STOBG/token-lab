import { useState } from 'react'
import type { ResolvedToken } from '../tokens/token-types'

interface PreviewWorkspaceProps {
    resolved: Record<string, ResolvedToken>
    onSelectComponent: (componentId: string) => void
}

type PreviewId = 'homepage' | 'markets' | 'project-detail' | 'careers' | 'contact'

const pages: Array<{ id: PreviewId; label: string; title: string }> = [
    { id: 'homepage', label: 'Homepage', title: 'Homepage / Marketing' },
    { id: 'markets', label: 'Markets', title: 'Markets / Sectors' },
    { id: 'project-detail', label: 'Project detail', title: 'Project detail / North Quay' },
    { id: 'careers', label: 'Careers', title: 'Careers / Join the team' },
    { id: 'contact', label: 'Contact', title: 'Contact / Start a conversation' },
]

export function PreviewWorkspace({ resolved, onSelectComponent }: PreviewWorkspaceProps) {
    const [activePage, setActivePage] = useState<PreviewId>('homepage')
    const page = pages.find((item) => item.id === activePage) ?? pages[0]

    return (
        <section className="preview-area" aria-label="Preview workspace">
            <div className="preview-toolbar"><div><span className="eyebrow">LIVE PREVIEW</span><h2>{page.title}</h2></div><div className="toolbar-controls">{pages.map((item) => <button key={item.id} className={activePage === item.id ? 'page-tab active' : 'page-tab'} onClick={() => setActivePage(item.id)}>{item.label}</button>)}<button className="viewport">Desktop 1440</button></div></div>
            <div className="preview-canvas"><div className="site-preview"><div className="site-nav"><strong>TOKEN LAB</strong><span>What we do</span><span>Our work</span><span>About us</span><button>Contact us ↗</button></div>{activePage === 'homepage' && <Homepage resolved={resolved} onSelectComponent={onSelectComponent} />}{activePage === 'markets' && <Markets resolved={resolved} onSelectComponent={onSelectComponent} />}{activePage === 'project-detail' && <ProjectDetail resolved={resolved} onSelectComponent={onSelectComponent} />}{activePage === 'careers' && <Careers resolved={resolved} onSelectComponent={onSelectComponent} />}{activePage === 'contact' && <Contact resolved={resolved} onSelectComponent={onSelectComponent} />}</div></div>
        </section>
    )
}

function Homepage({ resolved, onSelectComponent }: PreviewWorkspaceProps) {
    return <><button className="site-hero" onClick={() => onSelectComponent('homepage-hero')} style={{ backgroundColor: resolved['accent-brand'].value }}><span className="preview-tag">HOMEPAGE HERO · CLICK TO INSPECT</span><h3>Building a better<br /><em>every day.</em></h3><p>We create places, services and experiences that help communities thrive.</p><span className="hero-cta" style={{ backgroundColor: resolved['action-primary'].value, color: resolved['text-primary'].value }}>Explore our work <b>↗</b></span></button><button className="projects" onClick={() => onSelectComponent('featured-projects')} style={{ backgroundColor: resolved['background-subtle'].value }}><div className="section-label"><span>01</span><strong>Featured projects</strong><span className="rule" /></div><div className="project-grid"><div className="project-card"><div className="project-art art-one" /><strong style={{ color: resolved['text-primary'].value }}>North Quay Commons</strong><small>Regeneration · Manchester</small></div><div className="project-card"><div className="project-art art-two" /><strong style={{ color: resolved['text-primary'].value }}>The Exchange</strong><small>Workplace · Birmingham</small></div></div></button></>
}

function Markets({ resolved, onSelectComponent }: PreviewWorkspaceProps) {
    return <div className="markets-page" style={{ backgroundColor: resolved['background-subtle'].value }}><div className="markets-heading"><div><span className="preview-tag">MARKETS / 03 SECTORS</span><h3>Find your<br /><em>place.</em></h3></div><p>We work across the spaces where everyday life happens.</p></div><div className="market-list">{['Workplace', 'Living', 'Education'].map((market, index) => <button key={market} onClick={() => onSelectComponent('markets-hero')} style={{ color: resolved['text-primary'].value }}><span>0{index + 1}</span><strong>{market}</strong><b>↗</b></button>)}</div></div>
}

function ProjectDetail({ resolved, onSelectComponent }: PreviewWorkspaceProps) {
    return <div className="project-detail-page"><button className="project-detail-hero" onClick={() => onSelectComponent('project-detail-hero')} style={{ backgroundColor: resolved['accent-brand'].value }}><span className="preview-tag">PROJECT DETAIL / NORTH QUAY</span><h3>North Quay<br /><em>Commons</em></h3><span className="hero-cta" style={{ backgroundColor: resolved['action-primary'].value, color: resolved['text-primary'].value }}>View project story <b>↗</b></span></button><div className="project-detail-meta" style={{ backgroundColor: resolved['background-subtle'].value, color: resolved['text-primary'].value }}><div><span>LOCATION</span><strong>Manchester, UK</strong></div><div><span>STATUS</span><strong>Complete / 2025</strong></div><p>A new neighbourhood for the river edge, bringing work, culture and everyday life closer together.</p></div></div>
}

function Careers({ resolved, onSelectComponent }: PreviewWorkspaceProps) {
    return <div className="careers-page" style={{ backgroundColor: resolved['background-subtle'].value }}><div className="careers-intro"><span className="preview-tag">CAREERS / JOIN THE TEAM</span><h3>Make your<br /><em>mark here.</em></h3><p>Bring your curiosity, craft and perspective to a team building better places every day.</p></div><div className="careers-board"><div className="careers-board-head"><strong>OPEN ROLES</strong><span>03 opportunities</span></div>{['Senior designer', 'Project manager', 'Graduate placement'].map((role, index) => <button key={role} onClick={() => onSelectComponent('careers-hero')} style={{ color: resolved['text-primary'].value }}><span>0{index + 1}</span><strong>{role}</strong><b>View role ↗</b></button>)}</div></div>
}

function Contact({ resolved, onSelectComponent }: PreviewWorkspaceProps) {
    return <div className="contact-page" style={{ backgroundColor: resolved['background-subtle'].value }}><div className="contact-intro"><span className="preview-tag">CONTACT</span><h3>Let's make something useful.</h3><p>Tell us what you are working on and we will start the conversation.</p></div><button className="contact-form" onClick={() => onSelectComponent('contact-form')} style={{ backgroundColor: resolved['background-canvas'].value }}><label style={{ color: resolved['text-primary'].value }}>Your name<input placeholder="Name" /></label><label style={{ color: resolved['text-primary'].value }}>Your email<input placeholder="you@example.com" /></label><span className="hero-cta" style={{ backgroundColor: resolved['action-primary'].value, color: resolved['text-primary'].value }}>Send enquiry <b>↗</b></span></button></div>
}

