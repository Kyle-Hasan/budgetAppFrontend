import { budgetForm } from "@/components/budgets/CreateBudgetForm"
import { transaction } from "@/components/transactions/transactionItemChild"
import React, { ReactNode } from "react";
import { useState} from "react";
type FormContextType = {
    transactionForm: transaction | null,
    budgetForm: budgetForm | null,
    setTransactionForm: Function,
    setBudgetForm:Function



} | null

const FormContext= React.createContext<FormContextType>(null);

const FormProvider = ({ children }: { children: ReactNode })=> {

    const [transactionForm,setTransactionForm] = useState<transaction | null>(null)
    const [budgetForm, setBudgetForm] = useState<budgetForm | null>(null);
    
    return <FormContext.Provider value={{transactionForm,setBudgetForm,budgetForm,setTransactionForm}}>{children}</FormContext.Provider>
}

export {FormProvider,FormContext}


