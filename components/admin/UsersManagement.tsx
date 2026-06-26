'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Search,
  Shield,
  Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  users: any[]
}

const ROLES = [
  'student',
  'admin',
  'staff',
  'affiliate',
  'trainer',
]

export default function UsersManagement({
  users: initialUsers,
}: Props) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [changingRole, setChangingRole] =
    useState<string | null>(null)
  const router = useRouter()

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      (u.full_name || '')
        .toLowerCase()
        .includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    )
  })

  const handleRoleChange = async (
    userId: string,
    newRole: string
  ) => {
    setChangingRole(userId)
    try {
      await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, role: newRole }
            : u
        )
      )
      router.refresh()
    } finally {
      setChangingRole(null)
    }
  }

  return (
    <div>
      <div className="flex items-center
      justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: '#062850' }}
          >
            User Management
          </h1>
          <p className="text-gray-500 text-sm">
            {users.length} total users
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2
          -translate-y-1/2 w-4 h-4 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-11 pr-4 py-3
          rounded-xl border text-sm
          focus:outline-none focus:ring-2"
          style={{ borderColor: '#D1D5DB' }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border
      border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="border-b border-gray-100"
                style={{
                  backgroundColor: '#F0F6FB',
                }}
              >
                <th
                  className="text-left px-5 py-3
                  text-xs font-bold uppercase
                  tracking-wider"
                  style={{ color: '#497296' }}
                >
                  User
                </th>
                <th
                  className="text-left px-5 py-3
                  text-xs font-bold uppercase
                  tracking-wider"
                  style={{ color: '#497296' }}
                >
                  Country
                </th>
                <th
                  className="text-left px-5 py-3
                  text-xs font-bold uppercase
                  tracking-wider"
                  style={{ color: '#497296' }}
                >
                  Role
                </th>
                <th
                  className="text-left px-5 py-3
                  text-xs font-bold uppercase
                  tracking-wider"
                  style={{ color: '#497296' }}
                >
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b
                  border-gray-50 last:border-0
                  hover:bg-gray-50/50
                  transition-colors"
                >
                  <td className="px-5 py-4">
                    <p
                      className="text-sm
                      font-semibold"
                      style={{ color: '#062850' }}
                    >
                      {user.full_name || '—'}
                    </p>
                    <p className="text-xs
                    text-gray-500">
                      {user.email}
                    </p>
                  </td>
                  <td className="px-5 py-4
                  text-sm text-gray-600">
                    {user.country || '—'}
                  </td>
                  <td className="px-5 py-4">
                    {changingRole === user.id ? (
                      <Loader2
                        className="w-4 h-4
                        animate-spin"
                        style={{
                          color: '#497296',
                        }}
                      />
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user.id,
                            e.target.value
                          )
                        }
                        className="text-xs
                        font-medium px-3 py-1.5
                        rounded-lg border
                        focus:outline-none"
                        style={{
                          borderColor: '#D1D5DB',
                          color: '#062850',
                        }}
                      >
                        {ROLES.map((role) => (
                          <option
                            key={role}
                            value={role}
                          >
                            {role}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-4
                  text-xs text-gray-500">
                    {new Date(
                      user.created_at
                    ).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}