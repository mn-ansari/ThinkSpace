export { cn } from "cn"

export function submitOnEnter(submit: () => void){
    return (e: React.KeyboardEvent) => {
        // Enter while an IME is composing confirms the composition; don't submit.
        if(e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
        e.preventDefault();
        submit();
    }
}
