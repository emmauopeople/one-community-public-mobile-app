export const mockProviders = [
  {
    id: 'provider-1',
    name: 'Mboa Fine Carpentry',
    city: 'Douala',
    region: 'Littoral',
    area: 'Bonaberi',
    statusLabel: 'Profile Reviewed',
    whatsapp: '237600000001',
    bio: 'Local carpentry team for furniture repair, doors, cabinets, shelves, and custom wood work.'
  },
  {
    id: 'provider-2',
    name: 'Grace Tailoring Studio',
    city: 'Yaounde',
    region: 'Centre',
    area: 'Bastos',
    statusLabel: 'Approved Provider',
    whatsapp: '237600000002',
    bio: 'Tailoring service for women, men, school uniforms, repairs, and traditional outfits.'
  },
  {
    id: 'provider-3',
    name: 'QuickFix Electrical',
    city: 'Bamenda',
    region: 'North West',
    area: 'Commercial Avenue',
    statusLabel: 'Available by WhatsApp',
    whatsapp: '237600000003',
    bio: 'Electrical repairs, wiring checks, lights, sockets, and small home electrical installations.'
  }
];

export const mockSkills = [
  {
    id: 'skill-1',
    providerId: 'provider-1',
    title: 'Custom Furniture and Wood Repair',
    category: 'Carpentry',
    city: 'Douala',
    region: 'Littoral',
    area: 'Bonaberi',
    trustLabel: 'Profile Reviewed',
    shortDescription: 'Furniture repair, cabinets, shelves, doors, and custom carpentry for homes and small businesses.',
    description: 'Mboa Fine Carpentry provides practical wood work for homes and small businesses. Services include furniture repair, shelves, cabinets, door repair, small tables, and simple custom designs. The team can discuss the work by WhatsApp before visiting the customer.',
    imageUrl: 'https://placehold.co/900x600/png?text=Carpentry',
    images: ['https://placehold.co/900x600/png?text=Carpentry']
  },
  {
    id: 'skill-2',
    providerId: 'provider-2',
    title: 'Tailoring and Clothing Repairs',
    category: 'Tailoring',
    city: 'Yaounde',
    region: 'Centre',
    area: 'Bastos',
    trustLabel: 'Approved Provider',
    shortDescription: 'Clothing repairs, measurements, traditional outfits, school uniforms, and simple custom designs.',
    description: 'Grace Tailoring Studio supports customers with clothing repairs, measurements, traditional outfits, uniforms, and everyday clothing adjustments. Customers can contact the provider to explain the type of clothing and preferred date.',
    imageUrl: 'https://placehold.co/900x600/png?text=Tailoring',
    images: ['https://placehold.co/900x600/png?text=Tailoring']
  },
  {
    id: 'skill-3',
    providerId: 'provider-3',
    title: 'Home Electrical Repairs',
    category: 'Electrical',
    city: 'Bamenda',
    region: 'North West',
    area: 'Commercial Avenue',
    trustLabel: 'Available by WhatsApp',
    shortDescription: 'Basic electrical repair, sockets, light fixtures, wiring checks, and small installations.',
    description: 'QuickFix Electrical helps with small home electrical issues including light fixtures, sockets, wiring checks, and simple installations. Customers should describe the issue clearly before requesting a visit.',
    imageUrl: 'https://placehold.co/900x600/png?text=Electrical',
    images: ['https://placehold.co/900x600/png?text=Electrical']
  }
];

export const getProviderById = (providerId) => mockProviders.find((provider) => provider.id === providerId);

export const getSkillsByProviderId = (providerId) => mockSkills.filter((skill) => skill.providerId === providerId);
