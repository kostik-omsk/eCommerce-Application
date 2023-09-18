import rss from '@assets/rss.jpg';
import nikita from '@assets/nikita.png';

export interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  nickname?: string;
  githubLink: string;
  role?: string;
  description: string;
}

export const team: TeamMember[] = [
  {
    id: 1,
    name: 'Mikita Karalkou',
    avatar: nikita,
    nickname: 'HunterTigerX',
    githubLink: 'https://github.com/huntertigerx',
    role: 'Team lead',
    description:
      'I am from Minsk, BSUIR graduate. On the project I implemented a shopping cart, product cards, login page, profile page with the required functionality, wrote jest tests, added products to e-commerce, participated in the development of styles, routing, flow, development of sprints and cards in Jira, installing dependencies and etc.',
  },
  {
    id: 2,
    name: 'Vitaly Schneider',
    avatar: 'https://avatars.githubusercontent.com/u/87146694?v=4',
    nickname: 'h3nnessey',
    githubLink: 'https://github.com/h3nnessey',
    role: 'API Integration Architect',
    description:
      'A resident of Perm, a young IT specialist, was born with a keyboard in his hands and has knowledge of all mathematical formulas. On the project, my task was to integrate the Commerce Tools API. I wrote auxiliary Hooks and Reducers to manage the client, categories, and products. Additionally, I implemented components for product search, category selection, pagination, and breadcrumbs. I handled the overall routing configuration and was responsible for build and deployment.',
  },
  {
    id: 3,
    name: 'Konstantin Sidorenko',
    avatar: 'https://avatars.githubusercontent.com/u/93988894?v=4',
    nickname: 'kostik-omsk',
    githubLink: 'https://github.com/kostik-omsk',
    role: 'API Integration Architect',
    description:
      'Born, attended kindergarten, then school, university, and finally started working. As part of the project, my responsibilities included general work on the creation of components and their design, including the navigation bar, catalog pages, product cards and product filter. I have also developed a registration page and a form, as well as an About page.',
  },
  {
    id: 4,
    name: 'RS School',
    avatar: rss,
    githubLink: 'https://rs.school/',
    description:
      'Is free-of-charge and community-based education program conducted by The Rolling Scopes developer community since 2013.',
  },
];
