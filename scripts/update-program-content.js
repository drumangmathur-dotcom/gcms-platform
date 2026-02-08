// Script to update programs with enriched content
// Run with: node scripts/update-program-content.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const programsData = {
    wisconsin: {
        images: [
            "/brain/80c4bfdd-a0d6-41c2-b703-d5cc9b2646db/wisconsin_hospital_exterior_1770492945200.png",
            "/brain/80c4bfdd-a0d6-41c2-b703-d5cc9b2646db/wisconsin_clinical_training_1770492966337.png",
            "https://images.unsplash.com/photo-1519494026892-80ba456adc66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        description: "The University of Wisconsin-Madison is a premier public research university recognized globally for its medical school and hospital systems. The UW Health network serves as a comprehensive academic medical center where clinical excellence meets cutting-edge research. International medical students gain exposure to Big Ten academic medicine in a supportive Midwest setting, though access is primarily through institutional partnerships rather than individual applications.",
        unique_features: [
            "Department chair-signed letters of recommendation carrying significant weight in ERAS applications",
            "Access to one of the nation's largest academic medical centers with Level I trauma designation",
            "Exposure to rural medicine outreach programs alongside urban tertiary care",
            "Integration with the Wisconsin Institutes for Medical Research for translational science exposure",
            "Strong primary care focus balanced with advanced subspecialty services"
        ],
        advantages: [
            "Premier Academic Medicine: Ranked among top 30 medical schools nationally with world-class faculty mentorship",
            "Midwest Safety & Affordability: Madison consistently ranks as one of America's safest and most livable cities with reasonable cost of living",
            "Comprehensive Clinical Exposure: 600+ bed hospital with all major specialties represented",
            "Strong Letter Support: Department chairs actively mentor international students and provide detailed recommendation letters",
            "Simulation Excellence: State-of-the-art simulation center for procedural skill development before clinical application",
            "Research Opportunities: Easy access to ongoing clinical trials and research projects for CV enhancement"
        ],
        disadvantages: [
            "VSLO Access Limitations: Traditional clinical rotations for international medical students (IMGs) are restricted; most access requires institutional affiliation agreements",
            "Harsh Winter Climate: November through March brings severe cold (-20°F) and heavy snowfall, challenging for those from tropical climates",
            "Limited Public Transit: Car-dependent city with minimal subway/metro infrastructure unlike coastal urban centers",
            "Smaller Social Scene: More subdued nightlife and international community compared to Chicago or coastal hubs",
            "Competitive Placement: High demand for spots means early application (6+ months ahead) is critical"
        ],
        pros: [
            "Top-Tier Academic Research Institution",
            "Midwest Safety Profile with Low Crime Rates",
            "Strong Ophthalmology & Internal Medicine Departments",
            "Department Chair-Signed Letters of Recommendation",
            "Active Clinical Exposure in Teaching Hospital"
        ],
        cons: [
            "Severe Winter Weather (Nov-Mar)",
            "Smaller City Feel Compared to Coastal Hubs",
            "Limited Public Transportation"
        ],
        student_feedback: "Students on Reddit note that UW-Madison clinical rotations are 'observational-heavy' for international students due to VSLO restrictions, but those who secure spots through partnerships report 'incredibly supportive attendings' and 'small group teaching that feels like private rounds.' The simulation center is frequently praised as 'among the best in the country' for procedural practice. Winter weather is consistently mentioned as a challenge, with one student noting 'bring thermals from home - Madison winter is no joke.'",
        departments: ["Internal Medicine", "Surgery", "Ophthalmology", "Pediatrics", "Family Medicine", "Emergency Medicine"],
        duration: "4 weeks",
        housing: "On-campus graduate housing available through University Housing; most clinical students stay at Eagle Heights or Pandora Apartments within walking distance of hospital"
    },
    hopkins: {
        images: [
            "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1519167758481-83f29da73ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1582719366811-dcf8f6c0e733?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Johns Hopkins Hospital is consistently ranked #1 in the United States and recognized worldwide as the pinnacle of medical excellence. The Visiting Medical Student Program offers international medical graduates a rare opportunity to train alongside future leaders in medicine. Clinical electives are intensive, four-week immersions where students are expected to be active participants in patient care, not mere observers. The experience provides unparalleled exposure to cutting-edge medicine, world-renowned faculty, and a culture of academic excellence that has defined American medical education for over a century.",
        unique_features: [
            "Consistently ranked #1 hospital in the United States by U.S. News & World Report for over 20 consecutive years",
            "Historic 'Hopkins Way' of bedside teaching that pioneered modern medical education",
            "Access to the Sheikh Zayed Cardiovascular and Critical Care Tower - one of the world's most advanced cardiac care facilities",
            "Integration between medical school, hospital, and Bloomberg School of Public Health for interdisciplinary learning",
            "'The Dome' - iconic architectural landmark symbolizing medical excellence globally"
        ],
        advantages: [
            "Unmatched Prestige: A Hopkins rotation on your CV opens doors at top-tier residency programs nationwide",
            "Active Clinical Participation: Unlike many elite institutions, Hopkins encourages hands-on patient management under supervision",
            "World-Class Letters of Recommendation: Faculty letters from Hopkins carry extraordinary weight in ERAS applications and are known for being detailed and supportive",
            "Research Integration: Easy access to ongoing clinical trials, translational research, and publication opportunities with global impact",
            "Network Effect: Fellow students often become future program directors, department chairs, and thought leaders - invaluable for long-term career networking",
            "International IMG Support: Dedicated office assists with visa documentation, housing, and cultural integration"
        ],
        disadvantages: [
            "High Cost Structure: Elective fees are substantial ($5,500 for non-affiliated international students) plus Baltimore's rising cost of living",
            "Baltimore Safety Concerns: Some neighborhoods require careful housing selection; university provides guidance but students must be vigilant",
            "Extremely Competitive: Highly sought-after spots mean 4-6 month advance application required; many excellent candidates still face rejection",
            "Intense Workload: Expect to 'go above and beyond' - this is not an observership; demands are high and pace is rapid",
            "Limited Hands-On in High-Demand Specialties: Popular rotations like cardiology may have more observation than participation due to crowding",
            "Affiliation Requirements: Students from non-LCME schools need active institutional partnership agreements with Hopkins, limiting access"
        ],
        pros: [
            "#1 Ranked Hospital in the United States",
            "Global Brand Recognition for Residency Applications",
            "Historic Prestige in Medical Education",
            "Access to Cutting-Edge Research Facilities",
            "Strong International Medical Graduate Support"
        ],
        cons: [
            "High Cost of Living in Baltimore",
            "Baltimore Safety Concerns (Housing Guidance Required)",
            "Highly Competitive Rotation Spots",
            "Limited Hands-On Experience Due to High Demand"
        ],
        student_feedback: "IMGs on Reddit and Student Doctor Network consistently describe Hopkins electives as 'career-changing' and 'the best investment.' One student shared: 'The faculty genuinely want you to succeed - they take time to teach even on busy service days.' However, multiple sources warn it's 'not a vacation rotation' - expect long hours and high expectations. The LORs are frequently cited as 'worth the entire cost' for their detail and impact. Baltimore's safety is mentioned often: 'Stick to recommended neighborhoods like Federal Hill or Canton, avoid wandering at night.'",
        departments: ["Oncology", "Cardiology", "Neurosurgery", "Emergency Medicine", "Infectious Disease", "Radiology"],
        duration: "4 weeks (rigid schedule, no extensions)",
        housing: "University provides housing guidance; most students stay in Federal Hill, Fells Point, or Inner Harbor areas with 15-20 minute commute to hospital"
    },
    edinburgh: {
        images: [
            "https://images.unsplash.com/photo-1555604421-68c7e5e7be51?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1591634616548-5da80b932270?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        description: "The University of Edinburgh Medical School, founded in 1726, is the oldest English-speaking medical school in the world and remains a global leader in medical education. Clinical attachments in Edinburgh provide international medical graduates unique exposure to the NHS Scotland system, a single-payer healthcare model fundamentally different from the US insurance-based approach. While placements are primarily observational, they offer invaluable learning in multidisciplinary team dynamics, resource-conscious medicine, and patient-centered care within a socialized healthcare framework. The experience is particularly valuable for students considering UK practice pathways or those seeking to understand alternative healthcare delivery models.",
        unique_features: [
            "Oldest medical school in the English-speaking world with unbroken teaching tradition since 1726",
            "Exposure to NHS Scotland's single-payer system - fundamentally different from US healthcare economics",
            "Edinburgh Royal Infirmary - one of Europe's largest teaching hospitals with cutting-edge facilities",
            "Integrated clinical attachments across multiple NHS Lothian sites for diverse patient populations",
            "Historic campus blending centuries-old architecture with state-of-the-art medical simulation centers"
        ],
        advantages: [
            "NHS System Mastery: Learn socialized medicine firsthand - valuable for global health understanding and UK career pathways",
            "GMC Registration Pathway Support: Clinical attachment experience strengthens General Medical Council (GMC) registration applications for UK practice",
            "Safe & Beautiful City: Edinburgh consistently ranks as one of Europe's safest capitals with spectacular architecture and culture",
            "Walkable Everything: World-class city where hospital, housing, and amenities are within walking distance - no car needed",
            "Observational Learning Excellence: Attend consultant-led ward rounds, MDT meetings, and clinics without the pressure of direct patient responsibility",
            "Cultural Immersion: Living in Scotland offers unique cultural experience, historic sites (Edinburgh Castle, Royal Mile), and friendly locals"
        ],
        disadvantages: [
            "Strictly Observational: UK clinical attachments prohibit direct patient care, intimate examinations, prescribing, or procedures - purely shadowing",
            "Limited US Residency Advantage: NHS experience doesn't translate as directly to US residency applications as USMLE-aligned rotations",
            "Longer Visa Processing: UK Standard Visitor visa can take weeks; requires careful planning and documentation",
            "Hands-Off Culture: NHS clinical governance rules are strict - even experienced IMGs cannot participate clinically without full GMC registration",
            "Unpaid With Costs: Attachments are unpaid and incur £400 matriculation fee plus travel, living expenses, and visa costs",
            "Weather: Scottish weather is unpredictable - bring layers and rain gear for all seasons"
        ],
        pros: [
            "NHS System Exposure (Different from US Model)",
            "Historic Prestige - Oldest Medical School in English-Speaking World",
            "Safe, Walkable City with Rich Culture",
            "Strong GMC Recognition for UK Practice Pathway",
            "Beautiful Campus with Modern Facilities"
        ],
        cons: [
            "Stricter 'Hands-Off' Patient Rules in NHS",
            "Longer Visa Processing Time for UK",
            "Limited Direct US Residency Advantage",
            "Observership-Heavy vs. Clinical Participation"
        ],
        student_feedback: "IMGs on forums describe Edinburgh attachments as 'eye-opening for understanding how efficient healthcare can be with limited resources' and 'fantastic for seeing medicine outside the US bubble.' One student noted: 'I learned more about holistic care and MDT dynamics here than in any US rotation.' However, multiple sources emphasize the observational limitations: 'You're truly shadowing, not doing - good for learning systems but frustrating if you want hands-on.' The city is universally praised: 'Edinburgh feels like Hogwarts meets modern medicine - absolutely beautiful and incredibly safe.'",
        departments: ["General Medicine", "Surgery", "Geriatrics", "Public Health", "Psychiatry", "General Practice"],
        duration: "4 weeks (flexible start dates throughout academic year)",
        housing: "University of Edinburgh Accommodation Service provides guidance for short-term rentals; many students stay in Marchmont or Newington neighborhoods (10-15 min walk to hospital)"
    }
};

async function updatePrograms() {
    console.log('🚀 Starting program content update...\n');

    for (const [slug, content] of Object.entries(programsData)) {
        console.log(`📝 Updating ${slug}...`);

        const { data, error } = await supabase
            .from('programs')
            .update({ content_json: content })
            .eq('slug', slug)
            .select();

        if (error) {
            console.error(`❌ Error updating ${slug}:`, error.message);
        } else {
            console.log(`✅ ${slug} updated successfully`);
        }
    }

    console.log('\n🎉 All programs updated with enriched content!');
    console.log('\nRefresh your browser to see the changes.');
}

updatePrograms().catch(console.error);
