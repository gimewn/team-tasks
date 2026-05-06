import { cn } from '@/lib/utils';
import type { TeamMember } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MemberAvatarProps {
  member: TeamMember;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'size-6 text-[10px]',
  md: 'size-8 text-xs',
  lg: 'size-10 text-sm',
};

export function MemberAvatar({
  member,
  size = 'md',
  showTooltip = true,
  className,
}: MemberAvatarProps) {
  const avatar = (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-semibold select-none',
        member.color,
        sizeClasses[size],
        className
      )}
    >
      {member.initials}
    </div>
  );

  if (!showTooltip) return avatar;

  return (
    <Tooltip>
      <TooltipTrigger render={avatar} />
      <TooltipContent>{member.name}</TooltipContent>
    </Tooltip>
  );
}
