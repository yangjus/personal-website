import { ArrowUpRight } from 'lucide-react';
import { companyProfiles } from '@/data/siteContent';

export function CompanyStrip() {
  return <div className="trusted-strip container" aria-label="Work companies">
    <span className="micro">Where I've worked at</span>
    {companyProfiles.map(company=><a key={company.mark} className={`company-link company-link-${company.mark}`} href={company.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${company.name} website (opens in a new tab)`}>
      <span className={`company-mark company-${company.mark}`} aria-hidden="true">
        {company.mark==='amazon'?<>amazon<svg className="amazon-smile" viewBox="0 0 96 22" fill="none"><path d="M8 5Q46 24 82 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M74 4L86 3L83 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></>:null}
        {company.mark==='tesla'?<><span className="company-logo company-logo-tesla"/>TESLA</>:null}
        {company.mark==='capital'?<span className="company-logo company-logo-capital"/>:null}
        {company.mark==='riot'?<>RIOT<br/><span>GAMES</span></>:null}
        {company.mark==='fama'?<>fama<span>.</span></>:null}
      </span>
      <ArrowUpRight className="company-arrow" size={12} aria-hidden="true"/>
    </a>)}
  </div>;
}
