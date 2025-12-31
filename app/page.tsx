import { Button } from "@/components/ui/button";

export default function Home() {
  const onPress = () => {
    console.log("Button pressed");
    
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button onClick={onPress}>Hello World</Button>
    </div>
  );
}
