import React from 'react'

type Props = {
    text: string,
    onClick: () => void,
    errorMessage?: string,
}
const FormButton = ({ onClick, text, errorMessage }: Props) => {
    return (
        <div className='flex flex-col gap-1'>
            <input
                className='mt-8 py-1 w-full border rounded bg-orange-600 text-white hover:bg-orange-500 cursor-pointer'
                type={"button"}
                value={text}
                onClick={onClick}
            />
            {
                errorMessage && errorMessage !== "" && <span className='text-red-400 text-sm'>{errorMessage}</span>
            }
            
        </div>

    )
}

export default FormButton