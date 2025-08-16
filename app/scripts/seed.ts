
import { db } from '../lib/db';

async function main() {
  console.log('Seeding federal grants database...');

  // Sample federal grants data based on grants.gov research
  const grantsData = [
    {
      opportunityId: 'EPA-R6-OW-2025-01',
      opportunityNumber: 'EPA-R6-OW-2025-001',
      title: 'Clean Water Infrastructure Improvement Grants',
      description: 'The Clean Water Infrastructure Improvement Program provides financial assistance to eligible entities for projects that improve water quality and infrastructure. This program supports upgrades to wastewater treatment facilities, stormwater management systems, and drinking water infrastructure to ensure compliance with federal water quality standards. Priority will be given to projects serving disadvantaged communities and those demonstrating innovative treatment technologies.',
      agencyCode: 'EPA',
      agencyName: 'Environmental Protection Agency',
      postDate: new Date('2025-01-15'),
      closeDate: new Date('2025-04-15'),
      archiveDate: new Date('2025-05-15'),
      estimatedTotalFunding: BigInt(50000000),
      awardCeiling: BigInt(5000000),
      awardFloor: BigInt(500000),
      expectedNumberOfAwards: 15,
      costSharingRequired: true,
      opportunityCategory: 'D',
      fundingInstrumentType: 'G',
      categoryOfFundingActivity: 'EJ',
      cfdaNumbers: ['66.458', '66.468'],
      eligibleApplicants: '00',
      additionalEligibilityInfo: 'State governments, local governments, public utilities, and tribal governments are eligible. Applicants must demonstrate financial capability and technical expertise.',
      fiscalYear: 2025,
      estimatedProjectStartDate: new Date('2025-07-01'),
    },
    {
      opportunityId: 'NSF-DRL-2025-02',
      opportunityNumber: 'NSF-25-531',
      title: 'STEM Education Innovation and Research Program',
      description: 'The STEM Education Innovation and Research (STEIR) program seeks to advance the effectiveness of STEM education through innovative research and development. This program supports projects that improve STEM teaching and learning at all educational levels, with emphasis on underrepresented populations in STEM fields. Proposals should demonstrate evidence-based practices and measurable outcomes.',
      agencyCode: 'NSF',
      agencyName: 'National Science Foundation',
      postDate: new Date('2025-02-01'),
      closeDate: new Date('2025-05-01'),
      archiveDate: new Date('2025-06-01'),
      estimatedTotalFunding: BigInt(25000000),
      awardCeiling: BigInt(1500000),
      awardFloor: BigInt(300000),
      expectedNumberOfAwards: 20,
      costSharingRequired: false,
      opportunityCategory: 'D',
      fundingInstrumentType: 'G',
      categoryOfFundingActivity: 'ED',
      cfdaNumbers: ['47.076'],
      eligibleApplicants: '13',
      additionalEligibilityInfo: 'Institutions of higher education, K-12 school districts, and nonprofit organizations with educational missions are eligible. Partnerships between institutions are encouraged.',
      fiscalYear: 2025,
      estimatedProjectStartDate: new Date('2025-09-01'),
    },
    {
      opportunityId: 'USDA-NIFA-2025-03',
      opportunityNumber: 'USDA-NIFA-ORG-008-25',
      title: 'Sustainable Agriculture Research and Education',
      description: 'The Sustainable Agriculture Research and Education (SARE) program funds research and education projects that improve the sustainability and profitability of American agriculture. Projects should address soil health, water conservation, biodiversity, climate resilience, and economic viability of farming operations. Special consideration given to projects benefiting beginning farmers and underserved communities.',
      agencyCode: 'USDA',
      agencyName: 'United States Department of Agriculture',
      postDate: new Date('2025-01-20'),
      closeDate: new Date('2025-03-20'),
      archiveDate: new Date('2025-04-20'),
      estimatedTotalFunding: BigInt(15000000),
      awardCeiling: BigInt(750000),
      awardFloor: BigInt(100000),
      expectedNumberOfAwards: 25,
      costSharingRequired: true,
      opportunityCategory: 'D',
      fundingInstrumentType: 'G',
      categoryOfFundingActivity: 'AG',
      cfdaNumbers: ['10.215'],
      eligibleApplicants: '00',
      additionalEligibilityInfo: 'State and local governments, institutions of higher education, nonprofit organizations, and tribal governments. Producer organizations and farmer cooperatives are also eligible.',
      fiscalYear: 2025,
      estimatedProjectStartDate: new Date('2025-06-01'),
    },
    {
      opportunityId: 'DOT-FTA-2025-04',
      opportunityNumber: 'FTA-2025-BUS-01',
      title: 'Electric Bus Infrastructure Development Program',
      description: 'The Electric Bus Infrastructure Development Program provides funding for the purchase of electric buses and supporting charging infrastructure for public transit agencies. This program supports the transition to clean energy transportation solutions and includes provisions for workforce training and technical assistance. Priority given to projects serving low-income and minority communities.',
      agencyCode: 'DOT',
      agencyName: 'Department of Transportation',
      postDate: new Date('2025-01-10'),
      closeDate: new Date('2025-04-10'),
      archiveDate: new Date('2025-05-10'),
      estimatedTotalFunding: BigInt(75000000),
      awardCeiling: BigInt(10000000),
      awardFloor: BigInt(1000000),
      expectedNumberOfAwards: 12,
      costSharingRequired: true,
      opportunityCategory: 'D',
      fundingInstrumentType: 'G',
      categoryOfFundingActivity: 'TR',
      cfdaNumbers: ['20.526'],
      eligibleApplicants: '04',
      additionalEligibilityInfo: 'Public transit agencies, state transportation departments, and local governments operating public transportation systems are eligible.',
      fiscalYear: 2025,
      estimatedProjectStartDate: new Date('2025-08-01'),
    },
    {
      opportunityId: 'HHS-CDC-2025-05',
      opportunityNumber: 'CDC-RFA-DP25-2501',
      title: 'Community Health Improvement and Disease Prevention',
      description: 'The Community Health Improvement and Disease Prevention program supports evidence-based strategies to reduce chronic disease burden and promote healthy behaviors in communities. Focus areas include diabetes prevention, cardiovascular health, cancer screening, and tobacco cessation programs. Projects must demonstrate community engagement and sustainable implementation.',
      agencyCode: 'HHS',
      agencyName: 'Department of Health and Human Services',
      postDate: new Date('2025-02-05'),
      closeDate: new Date('2025-04-05'),
      archiveDate: new Date('2025-05-05'),
      estimatedTotalFunding: BigInt(40000000),
      awardCeiling: BigInt(2000000),
      awardFloor: BigInt(200000),
      expectedNumberOfAwards: 30,
      costSharingRequired: false,
      opportunityCategory: 'D',
      fundingInstrumentType: 'CA',
      categoryOfFundingActivity: 'HL',
      cfdaNumbers: ['93.945'],
      eligibleApplicants: '00',
      additionalEligibilityInfo: 'State and local health departments, federally qualified health centers, tribal health organizations, and nonprofit public health organizations are eligible.',
      fiscalYear: 2025,
      estimatedProjectStartDate: new Date('2025-07-15'),
    },
    {
      opportunityId: 'DOE-EERE-2025-06',
      opportunityNumber: 'DE-FOA-0003089',
      title: 'Renewable Energy Technology Development and Deployment',
      description: 'The Renewable Energy Technology Development and Deployment program accelerates the development and deployment of clean energy technologies including solar, wind, geothermal, and energy storage systems. Projects should demonstrate technical innovation, cost reduction potential, and pathways to commercial scale deployment. Partnership with industry strongly encouraged.',
      agencyCode: 'DOE',
      agencyName: 'Department of Energy',
      postDate: new Date('2025-01-25'),
      closeDate: new Date('2025-05-25'),
      archiveDate: new Date('2025-06-25'),
      estimatedTotalFunding: BigInt(100000000),
      awardCeiling: BigInt(15000000),
      awardFloor: BigInt(2000000),
      expectedNumberOfAwards: 8,
      costSharingRequired: true,
      opportunityCategory: 'D',
      fundingInstrumentType: 'CA',
      categoryOfFundingActivity: 'EN',
      cfdaNumbers: ['81.087'],
      eligibleApplicants: '13',
      additionalEligibilityInfo: 'Universities, national laboratories, private companies, and state energy offices are eligible. Public-private partnerships are strongly encouraged.',
      fiscalYear: 2025,
      estimatedProjectStartDate: new Date('2025-10-01'),
    },
    {
      opportunityId: 'HUD-CPD-2025-07',
      opportunityNumber: 'FR-6700-N-25',
      title: 'Affordable Housing Development and Preservation',
      description: 'The Affordable Housing Development and Preservation program provides funding to increase the supply of affordable housing for low- and moderate-income families. Activities include new construction, rehabilitation, and preservation of existing affordable housing units. Projects must demonstrate long-term affordability commitments and community support.',
      agencyCode: 'HUD',
      agencyName: 'Department of Housing and Urban Development',
      postDate: new Date('2025-02-10'),
      closeDate: new Date('2025-06-10'),
      archiveDate: new Date('2025-07-10'),
      estimatedTotalFunding: BigInt(200000000),
      awardCeiling: BigInt(25000000),
      awardFloor: BigInt(5000000),
      expectedNumberOfAwards: 15,
      costSharingRequired: true,
      opportunityCategory: 'D',
      fundingInstrumentType: 'G',
      categoryOfFundingActivity: 'HO',
      cfdaNumbers: ['14.218'],
      eligibleApplicants: '00',
      additionalEligibilityInfo: 'State and local governments, public housing authorities, and qualified nonprofit housing organizations are eligible.',
      fiscalYear: 2025,
      estimatedProjectStartDate: new Date('2025-10-15'),
    },
    {
      opportunityId: 'NEA-ARP-2025-08',
      opportunityNumber: 'NEA-ARP-25-001',
      title: 'Arts Education and Community Engagement Program',
      description: 'The Arts Education and Community Engagement Program supports high-quality arts education programs that engage diverse communities and promote cultural understanding. Projects should demonstrate artistic excellence, educational impact, and community partnerships. Special emphasis on serving underrepresented populations and rural communities.',
      agencyCode: 'NEA',
      agencyName: 'National Endowment for the Arts',
      postDate: new Date('2025-01-30'),
      closeDate: new Date('2025-04-30'),
      archiveDate: new Date('2025-05-30'),
      estimatedTotalFunding: BigInt(8000000),
      awardCeiling: BigInt(500000),
      awardFloor: BigInt(50000),
      expectedNumberOfAwards: 40,
      costSharingRequired: true,
      opportunityCategory: 'D',
      fundingInstrumentType: 'G',
      categoryOfFundingActivity: 'AR',
      cfdaNumbers: ['45.024'],
      eligibleApplicants: '99',
      additionalEligibilityInfo: 'Nonprofit arts organizations, educational institutions, state and local governments, and tribal organizations are eligible.',
      fiscalYear: 2025,
      estimatedProjectStartDate: new Date('2025-08-15'),
    }
  ];

  // Create opportunities with contact information
  for (const grant of grantsData) {
    console.log(`Seeding grant: ${grant.title}`);
    
    const opportunity = await db.opportunity.create({
      data: {
        ...grant,
        contacts: {
          create: [
            {
              contactName: `Program Officer - ${grant.agencyName}`,
              contactEmail: `grants@${grant.agencyCode?.toLowerCase()}.gov`,
              contactPhone: '(202) 555-0100',
              contactText: `For questions regarding this opportunity, please contact the ${grant.agencyName} program office. Technical assistance webinars will be scheduled prior to the application deadline.`,
              additionalInfoUrl: `https://www.${grant.agencyCode?.toLowerCase()}.gov/grants`,
            }
          ]
        },
        changes: {
          create: [
            {
              changeType: 'new',
              source: 'seed_script',
              details: 'Initial opportunity creation'
            }
          ]
        }
      }
    });

    console.log(`Created opportunity: ${opportunity.title}`);
  }

  // Add some additional sample contacts and changes for variety
  const opportunities = await db.opportunity.findMany();
  
  // Add secondary contacts for some opportunities
  if (opportunities.length > 3) {
    await db.opportunityContact.create({
      data: {
        opportunityId: opportunities[1]?.id,
        contactName: 'Technical Assistance Coordinator',
        contactEmail: 'technical.assistance@nsf.gov',
        contactPhone: '(703) 555-0200',
        contactText: 'For technical questions about proposal submission and requirements.',
        additionalInfoUrl: 'https://www.nsf.gov/funding/'
      }
    });

    await db.opportunityContact.create({
      data: {
        opportunityId: opportunities[2]?.id,
        contactName: 'Regional Program Manager',
        contactEmail: 'sare.regional@usda.gov',
        contactPhone: '(202) 555-0300',
        contactText: 'Regional coordinator for sustainable agriculture programs.',
        additionalInfoUrl: 'https://www.sare.org/'
      }
    });
  }

  console.log(`Seeded ${grantsData.length} federal grant opportunities successfully!`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
