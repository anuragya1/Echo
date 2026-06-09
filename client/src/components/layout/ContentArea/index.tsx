import type{ FC, ReactNode } from "react";

type Props = {
    children: ReactNode;
}

const ContentArea: FC<Props> = ({ children }) => {
    return (
        <div className="xl:col-span-5 md:col-span-3 h-[calc(100dvh-3.5rem)] md:h-full min-h-0 overflow-y-auto">
            {children}
        </div>
    )
}

export default ContentArea;
