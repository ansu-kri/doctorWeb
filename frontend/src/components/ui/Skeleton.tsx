interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => <div className={`skeleton rounded-xl ${className}`} />;

export default Skeleton;