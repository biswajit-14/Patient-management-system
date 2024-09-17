import { StatusIcon } from '@/constants'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

const StatusBadge = ({ status }: { status: Status }) => {
    return (
        <div className={clsx('status-badge', {
            'bg-blue-600': status === 'pending',
            'bg-red-500': status === 'cancelled',
            'bg-green-500': status === 'scheduled',
        })}>
            <Image
                src={StatusIcon[status]}
                alt='status'
                width={24}
                height={24}
                className='h-fit w-3'
            />
            <p
                className={clsx('text-12-semibold capitalize', {
                    'bg-blue-500': status === 'pending',
                    'bg-red-600': status === 'cancelled',
                    'bg-green-600': status === 'scheduled',
                })}
            >{status}</p>
        </div>
    )
}

export default StatusBadge