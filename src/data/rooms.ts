export interface RoomDefinition {
  id: string
  number: string
  title: string
  folder: string | null
  source: { owner: string; repository: string; ref: string; path: string } | null
}
// Categories are labels, not claims that study records exist.
export const rooms: RoomDefinition[] = [
  { id: 'linux', number: '01', title: 'Linux Systems', folder: '01-linux', source: null },
  { id: 'network', number: '02', title: 'Network', folder: '02-network', source: null },
  { id: 'database', number: '03', title: 'Database', folder: '03-database', source: null },
  { id: 'cloud', number: '04', title: 'Cloud', folder: '04-cloud', source: null },
  { id: 'projects', number: '05', title: 'Projects', folder: '05-projects', source: null },
  { id: 'profile', number: '06', title: 'Profile', folder: null, source: null },
]
