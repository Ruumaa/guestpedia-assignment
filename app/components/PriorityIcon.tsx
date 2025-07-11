import { Priority } from '@/types/type';
import React from 'react';
import { FaCheckSquare, FaGripLines } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const PriorityIcon = (priority: Priority | undefined) => {
  switch (priority) {
    case 'low':
      return <IoIosArrowDown className="text-blue-400 size-5" />;
    case 'medium':
      return <FaGripLines className="text-yellow-400  size-4" />;
    case 'high':
      return <IoIosArrowUp className="text-red-400 size-5" />;
    default:
      return <FaCheckSquare />;
  }
};

export default PriorityIcon;
