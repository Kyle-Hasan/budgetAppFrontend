import { transaction } from "@/components/transactions/transactionItemChild";
import React, { ReactNode, useState } from "react";
import { budgetForm } from "../../components/budgets/CreateBudgetForm";
import { accountForm } from "@/components/accounts/AccountForm";
import { RecurringTransaction } from "@/components/recurringTransactions/RecurringTransactionForm";

type FormContextType = {
    transactionForm: transaction | null;
    budgetForm: budgetForm | null;
    setTransactionForm: (form: transaction | null) => void;
    setBudgetForm: (form: budgetForm | null) => void;
    accountForm: accountForm | null;
    setAccountForm: (form: accountForm | null) => void;
    setRecurringTransactionForm:(form:RecurringTransaction | null) => void;
    recurringTransactionForm:RecurringTransaction | null
   
} | null;

const FormContext = React.createContext<FormContextType>(null);

const FormProvider = ({ children }: { children: ReactNode }) => {
    const [transactionForm, setTransactionForm] = useState<transaction | null>(null);
    const [budgetForm, setBudgetForm] = useState<budgetForm | null>(null);
    const [accountForm, setAccountForm] = useState<accountForm | null>(null);
   
    const [recurringTransactionForm,setRecurringTransactionForm] = useState<RecurringTransaction | null>(null)

    return (
        <FormContext.Provider 
            value={{
                transactionForm,
                setTransactionForm,
                budgetForm,
                setBudgetForm,
                accountForm,
                setAccountForm,
                recurringTransactionForm,
                setRecurringTransactionForm
            
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

export { FormProvider, FormContext };
