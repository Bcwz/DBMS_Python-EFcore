type TimeoutRequestInt = RequestInit & { timeout?: number }

interface SubmitEvent extends Event
{
    submitter: HTMLElement;
}

interface ButtonEvent extends EventTarget
{
    target: HTMLButtonElement
}