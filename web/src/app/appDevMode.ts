export default function appDevMode(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
  return (window as any).__qing_dev__;
}
