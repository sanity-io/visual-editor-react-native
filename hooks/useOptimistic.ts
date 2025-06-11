export default function useOptimistic<T>(initialArray: T[], 
    handler: (currentArray: T[], action: { id: string, document: { [key: string]: T[] } }) => T[]){
    return initialArray
}