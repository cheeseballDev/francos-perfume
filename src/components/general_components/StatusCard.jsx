import { CircleQuestionMark } from 'lucide-react';

const StatusCard = ({
    title, 
    mainValue = "0", 
    subText = "no label",
    Icon = CircleQuestionMark, 
    color = "text-custom-black",
    secondValue,
    thirdValue,
}) => {

    return (
        <div className="bg-custom-white border border-b-slate-100 rounded-2xl p-6 w-full h-full shadow-sm mr-4">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-custom-black text-xl">{title}</h3>
                <Icon className={color} size={24}></Icon>
            </div>
            <div className="text-3xl font-bold pt-6">{mainValue}</div>
            <div className="text-custom-gray text-xl pt-2"><span className={color}>{secondValue}</span>{subText}</div>
        </div>
    );
};

export default StatusCard;