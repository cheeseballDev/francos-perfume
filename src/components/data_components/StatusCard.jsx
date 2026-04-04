import { CircleQuestionMark } from 'lucide-react';

const StatusCard = ({
    title, 
    mainValue = "0", 
    subText,
    Icon = CircleQuestionMark, 
    color = "text-custom-black",
    secondValue,
    thirdValue,
    secondSubText,
}) => {

    return (
        <div className="border border-custom-gray rounded-2xl p-6 w-max-50 h-full shadow-sm mr-4 transition duration-300 hover:scale-105">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-custom-black text-xl">{title}</h3>
                <Icon className={color} size={24}></Icon>
            </div>
            <div className="text-3xl font-bold pt-6">{mainValue}</div>
            <div className="flex items-center gap-1 text-custom-gray text-xl pt-2">
                {secondValue && <span className={`${color} font-bold`}>{secondValue}</span>}
                {subText}
                {thirdValue && <span className={`${color} font-bold`}>{thirdValue}</span>}
                {secondSubText}
            </div>
        </div>
    );
};

/*
    Note to self: I can just put a division to any color i want to make it transparent
*/

export default StatusCard;