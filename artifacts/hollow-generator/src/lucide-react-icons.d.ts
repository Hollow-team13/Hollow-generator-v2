declare module 'lucide-react/dist/esm/icons/*.js' {
  const Icon: import('react').ComponentType<
    import('react').SVGProps<SVGSVGElement> & {
      size?: number | string;
      strokeWidth?: number;
    }
  >;

  export default Icon;
}
