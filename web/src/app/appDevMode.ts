export default function appDevMode(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).__qing_dev__;
}
