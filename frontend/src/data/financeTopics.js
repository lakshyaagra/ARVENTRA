const financeTopics = [
  // ============================================================
  // MONEY BASICS
  // ============================================================

  {
    id: "understanding-money",
    category: "Money Basics",
    title: "Understanding Money",
    description:
      "A simple introduction to how money works, how we earn it, spend it, save it, and make decisions around it.",

    sections: [
      {
        heading: "What is money?",
        paragraphs: [
          "Money is a medium that people use to exchange goods and services, measure value, and store purchasing power.",
          "In everyday life, money connects many financial decisions together. Income gives you money to work with, expenses determine where it goes, and saving and investing determine what happens to the money you do not spend."
        ]
      },
      {
        heading: "How money moves through your life",
        paragraphs: [
          "A simple way to understand personal finance is to think about money as a flow. Money comes in through sources such as salary, business income, investments, or other earnings.",
          "Some of that money is then used for necessities, lifestyle expenses, debt payments, and other commitments. The amount that remains can potentially be saved or invested."
        ]
      },
      {
        heading: "Why understanding money matters",
        paragraphs: [
          "Financial decisions become easier when you understand where your money is coming from, where it is going, and what you are trying to achieve with it.",
          "You do not need to understand every financial product before starting. A strong understanding of the basics gives you a foundation for making better decisions later."
        ]
      }
    ],

    relatedTopics: [
      "income-vs-expenses",
      "cash-flow",
      "assets-and-liabilities",
      "net-worth"
    ]
  },


  {
    id: "income-vs-expenses",
    category: "Money Basics",
    title: "Income vs Expenses",
    description:
      "Understand the two basic sides of personal cash flow: money coming in and money going out.",

    sections: [
      {
        heading: "What is income?",
        paragraphs: [
          "Income is money that you receive. For many people, the largest source of income is employment, but income can also come from a business, investments, rent, or other sources."
        ]
      },
      {
        heading: "What are expenses?",
        paragraphs: [
          "Expenses are the costs you pay for goods, services, commitments, and other needs or wants.",
          "Expenses can include housing, food, transportation, subscriptions, education, loan payments, and many other categories."
        ]
      },
      {
        heading: "Why the difference matters",
        paragraphs: [
          "The relationship between income and expenses determines how much money remains available for saving, investing, debt repayment, or other goals.",
          "Understanding this difference is one of the foundations of personal financial management."
        ]
      }
    ],

    relatedTopics: [
      "understanding-money",
      "cash-flow",
      "budgeting",
      "building-an-emergency-fund"
    ]
  },


  {
    id: "cash-flow",
    category: "Money Basics",
    title: "Understanding Cash Flow",
    description:
      "Learn how money entering and leaving your finances creates your personal cash flow.",

    sections: [
      {
        heading: "What is cash flow?",
        paragraphs: [
          "Cash flow describes the movement of money into and out of your finances over a period of time.",
          "Positive cash flow generally means more money is coming in than going out during that period, while negative cash flow means expenses and other outflows are greater than inflows."
        ]
      },
      {
        heading: "Why cash flow matters",
        paragraphs: [
          "A person can earn a reasonable income and still experience financial difficulty if their expenses and financial commitments consistently consume most of their available money.",
          "Looking at cash flow can therefore provide a clearer picture of day-to-day financial health than looking at income alone."
        ]
      }
    ],

    relatedTopics: [
      "income-vs-expenses",
      "budgeting",
      "net-worth"
    ]
  },


  {
    id: "assets-and-liabilities",
    category: "Money Basics",
    title: "Assets and Liabilities",
    description:
      "Understand the difference between what you own and what you owe.",

    sections: [
      {
        heading: "What is an asset?",
        paragraphs: [
          "An asset is something that has financial value and is owned or controlled by you.",
          "Examples can include cash, investments, property, vehicles, and other items or financial resources with value."
        ]
      },
      {
        heading: "What is a liability?",
        paragraphs: [
          "A liability represents an amount that you owe to another party.",
          "Examples include loans, credit card balances, and other financial obligations."
        ]
      },
      {
        heading: "Why the distinction matters",
        paragraphs: [
          "Understanding assets and liabilities helps you see your financial position rather than focusing only on your monthly income and expenses."
        ]
      }
    ],

    relatedTopics: [
      "net-worth",
      "understanding-money",
      "how-loans-work",
      "managing-debt"
    ]
  },


  {
    id: "net-worth",
    category: "Money Basics",
    title: "Understanding Net Worth",
    description:
      "Learn how your assets and liabilities combine to give a picture of your overall financial position.",

    sections: [
      {
        heading: "What is net worth?",
        paragraphs: [
          "Net worth is the value of what you own after accounting for what you owe.",
          "A simple way to think about it is assets minus liabilities."
        ]
      },
      {
        heading: "Why track net worth?",
        paragraphs: [
          "Tracking net worth over time can help you understand whether your overall financial position is improving, remaining stable, or moving in the opposite direction."
        ]
      }
    ],

    relatedTopics: [
      "assets-and-liabilities",
      "cash-flow",
      "building-an-emergency-fund",
      "investing"
    ]
  },


  // ============================================================
  // SAVING
  // ============================================================

  {
    id: "why-saving-matters",
    category: "Saving",
    title: "Why Saving Matters",
    description:
      "Understand why keeping some money aside can give you flexibility and financial security.",

    sections: [
      {
        heading: "What does saving mean?",
        paragraphs: [
          "Saving means setting aside part of your available money instead of spending it immediately.",
          "Savings can serve different purposes, from handling unexpected expenses to preparing for a planned purchase."
        ]
      },
      {
        heading: "Saving gives you options",
        paragraphs: [
          "Having accessible savings can reduce the need to depend on expensive borrowing when an unexpected expense appears.",
          "It can also make it easier to work toward larger financial goals."
        ]
      }
    ],

    relatedTopics: [
      "building-an-emergency-fund",
      "financial-goals",
      "budgeting",
      "compound-interest"
    ]
  },


  {
    id: "building-an-emergency-fund",
    category: "Saving",
    title: "Building an Emergency Fund",
    description:
      "Learn why emergency savings exist and how they can protect your finances from unexpected expenses.",

    sections: [
      {
        heading: "What is an emergency fund?",
        paragraphs: [
          "An emergency fund is money set aside specifically for unexpected or urgent expenses.",
          "Examples might include an unexpected repair, medical expense, temporary loss of income, or another significant financial disruption."
        ]
      },
      {
        heading: "Why have one?",
        paragraphs: [
          "Without accessible savings, an unexpected expense may force you to rely on credit cards, loans, or money intended for another financial goal.",
          "An emergency fund creates a financial buffer between an unexpected event and the rest of your financial plan."
        ]
      },
      {
        heading: "Where should it be kept?",
        paragraphs: [
          "Emergency savings generally need to be accessible when they are needed. The appropriate place depends on your circumstances, liquidity needs, and risk tolerance."
        ]
      }
    ],

    relatedTopics: [
      "why-saving-matters",
      "financial-goals",
      "budgeting",
      "managing-debt"
    ]
  },


  {
    id: "financial-goals",
    category: "Financial Planning",
    title: "Setting Financial Goals",
    description:
      "Turn vague financial ambitions into clear goals that you can work toward.",

    sections: [
      {
        heading: "What is a financial goal?",
        paragraphs: [
          "A financial goal is a specific outcome that you want your money to help you achieve.",
          "Goals can be short-term, medium-term, or long-term."
        ]
      },
      {
        heading: "Make goals measurable",
        paragraphs: [
          "Instead of simply saying that you want to save more, define what you are saving for, how much you need, and the timeframe you are working with."
        ]
      }
    ],

    relatedTopics: [
      "why-saving-matters",
      "building-an-emergency-fund",
      "budgeting",
      "financial-plan"
    ]
  },


  // ============================================================
  // INVESTING
  // ============================================================

  {
    id: "investing",
    category: "Investing",
    title: "What Is Investing?",
    description:
      "Understand the basic idea behind investing and why people choose to put money into assets.",

    sections: [
      {
        heading: "What does investing mean?",
        paragraphs: [
          "Investing means putting money into assets or opportunities with the expectation that they may provide a return or increase in value over time.",
          "Unlike simply holding cash, investments generally involve some degree of uncertainty and risk."
        ]
      },
      {
        heading: "Why do people invest?",
        paragraphs: [
          "People may invest to pursue long-term financial goals, preserve purchasing power, build wealth, or generate potential income."
        ]
      },
      {
        heading: "Risk and return",
        paragraphs: [
          "Investments can produce gains as well as losses. Understanding the relationship between potential return, risk, and your own financial situation is an important part of investing."
        ]
      }
    ],

    relatedTopics: [
      "mutual-funds",
      "stocks",
      "bonds",
      "risk-vs-return",
      "diversification"
    ]
  },


  {
    id: "mutual-funds",
    category: "Investing",
    title: "Understanding Mutual Funds",
    description:
      "Learn what mutual funds are, how they work, and the important concepts to understand before investing.",

    sections: [
      {
        heading: "What is a mutual fund?",
        paragraphs: [
          "A mutual fund is an investment vehicle that pools money from multiple investors and invests that money in a portfolio of assets.",
          "Depending on the fund, those assets may include stocks, bonds, money-market instruments, or other securities."
        ]
      },
      {
        heading: "How does a mutual fund work?",
        paragraphs: [
          "Instead of choosing every investment individually, an investor puts money into the mutual fund.",
          "The fund then invests the pooled money according to its stated investment objective and strategy."
        ]
      },
      {
        heading: "Why do people invest in mutual funds?",
        paragraphs: [
          "One reason is diversification. A fund can spread investments across multiple securities rather than relying on a single investment.",
          "Mutual funds can also make investing more accessible because the fund manages the portfolio according to its stated strategy."
        ]
      },
      {
        heading: "Important terms",
        paragraphs: [
          "When researching mutual funds, investors may encounter terms such as NAV, expense ratio, assets under management, exit load, and investment objective.",
          "Understanding these terms can make it easier to compare different funds."
        ]
      },
      {
        heading: "Risks",
        paragraphs: [
          "Mutual funds are not risk-free. The level of risk depends on the assets held by the fund and its investment strategy.",
          "The value of an investment can rise or fall, and past performance does not guarantee future results."
        ]
      }
    ],

    relatedTopics: [
      "investing",
      "sip",
      "index-funds",
      "risk-vs-return",
      "diversification",
      "compound-interest"
    ]
  },


  {
    id: "sip",
    category: "Investing",
    title: "Understanding SIP",
    description:
      "Learn the basic idea behind systematic investment plans and how regular investing works.",

    sections: [
      {
        heading: "What is a SIP?",
        paragraphs: [
          "A Systematic Investment Plan, commonly called a SIP, is a method of investing a fixed amount at regular intervals into a mutual fund scheme.",
          "Instead of investing a large amount at one time, an investor contributes according to a chosen schedule."
        ]
      },
      {
        heading: "Why do people use SIPs?",
        paragraphs: [
          "Regular investing can help people build an investing habit and spread purchases over multiple points in time.",
          "However, a SIP does not eliminate investment risk and returns are not guaranteed."
        ]
      }
    ],

    relatedTopics: [
      "mutual-funds",
      "compound-interest",
      "risk-vs-return",
      "financial-goals"
    ]
  },


  {
    id: "stocks",
    category: "Investing",
    title: "Understanding Stocks",
    description:
      "Learn what owning a stock means and how stock markets work at a basic level.",

    sections: [
      {
        heading: "What is a stock?",
        paragraphs: [
          "A stock represents ownership in a company. When you own shares of a company, you own a portion of that company."
        ]
      },
      {
        heading: "How can stocks generate returns?",
        paragraphs: [
          "Investors may potentially benefit if the value of their shares increases. Some companies may also distribute part of their profits to shareholders through dividends."
        ]
      },
      {
        heading: "Why are stocks risky?",
        paragraphs: [
          "Stock prices can move significantly because of company performance, economic conditions, investor expectations, and many other factors."
        ]
      }
    ],

    relatedTopics: [
      "investing",
      "diversification",
      "risk-vs-return",
      "index-funds"
    ]
  },


  {
    id: "bonds",
    category: "Investing",
    title: "Understanding Bonds",
    description:
      "Learn how bonds work and why they are commonly considered a debt investment.",

    sections: [
      {
        heading: "What is a bond?",
        paragraphs: [
          "A bond is generally a debt instrument through which an investor lends money to an issuer for a defined period under specified terms."
        ]
      },
      {
        heading: "How bonds generate returns",
        paragraphs: [
          "Depending on the bond, investors may receive interest payments and repayment of principal according to the terms of the instrument."
        ]
      }
    ],

    relatedTopics: [
      "investing",
      "risk-vs-return",
      "mutual-funds"
    ]
  },


  {
    id: "index-funds",
    category: "Investing",
    title: "Understanding Index Funds",
    description:
      "Learn how index funds attempt to track a market index instead of actively selecting investments.",

    sections: [
      {
        heading: "What is an index fund?",
        paragraphs: [
          "An index fund is a fund designed to track the performance of a particular market index or benchmark."
        ]
      },
      {
        heading: "Why are index funds discussed so often?",
        paragraphs: [
          "Index funds can provide broad exposure to a group of securities through a single investment vehicle.",
          "Their approach is generally based on tracking an index rather than trying to actively select investments that will outperform it."
        ]
      }
    ],

    relatedTopics: [
      "mutual-funds",
      "diversification",
      "stocks",
      "risk-vs-return"
    ]
  },


  {
    id: "diversification",
    category: "Investing",
    title: "Understanding Diversification",
    description:
      "Learn why spreading investments across different assets can matter.",

    sections: [
      {
        heading: "What is diversification?",
        paragraphs: [
          "Diversification means spreading investments across different assets, companies, sectors, or other categories instead of concentrating everything in one place."
        ]
      },
      {
        heading: "Why diversify?",
        paragraphs: [
          "The idea is that different investments may behave differently under different conditions, potentially reducing the impact of poor performance from a single investment."
        ]
      }
    ],

    relatedTopics: [
      "investing",
      "mutual-funds",
      "index-funds",
      "risk-vs-return"
    ]
  },


  {
    id: "risk-vs-return",
    category: "Investing",
    title: "Risk vs Return",
    description:
      "Understand the basic relationship between the potential return and uncertainty associated with an investment.",

    sections: [
      {
        heading: "What is investment risk?",
        paragraphs: [
          "Investment risk refers to the uncertainty surrounding the outcome of an investment, including the possibility of losing money."
        ]
      },
      {
        heading: "What is return?",
        paragraphs: [
          "Return is the gain or loss produced by an investment over a period of time."
        ]
      },
      {
        heading: "Why the relationship matters",
        paragraphs: [
          "Different investments carry different levels and types of risk. Understanding this relationship helps investors evaluate whether an investment is appropriate for their goals and circumstances."
        ]
      }
    ],

    relatedTopics: [
      "investing",
      "diversification",
      "mutual-funds",
      "stocks",
      "bonds"
    ]
  },


  {
    id: "compound-interest",
    category: "Investing",
    title: "Understanding Compound Interest",
    description:
      "Learn how returns can themselves generate additional returns over time.",

    sections: [
      {
        heading: "What is compounding?",
        paragraphs: [
          "Compounding occurs when returns earned on money become part of the amount that can generate future returns.",
          "Over long periods, this can make the growth of money very different from simply earning returns on the original amount."
        ]
      },
      {
        heading: "Why time matters",
        paragraphs: [
          "Compounding becomes more powerful as money remains invested for longer periods because returns have more time to generate additional returns."
        ]
      }
    ],

    relatedTopics: [
      "investing",
      "sip",
      "mutual-funds",
      "financial-goals"
    ]
  },


  // ============================================================
  // CREDIT
  // ============================================================

  {
    id: "credit-score",
    category: "Credit",
    title: "Understanding Credit Scores",
    description:
      "Learn what a credit score represents and why your borrowing history can matter.",

    sections: [
      {
        heading: "What is a credit score?",
        paragraphs: [
          "A credit score is a numerical representation derived from information in a person's credit history.",
          "Lenders and financial institutions may use credit information as one factor when evaluating borrowing applications."
        ]
      },
      {
        heading: "What can affect credit?",
        paragraphs: [
          "Factors can include repayment history, outstanding credit, length of credit history, and other information used by the relevant credit reporting system."
        ]
      },
      {
        heading: "Why does it matter?",
        paragraphs: [
          "Credit information can influence how lenders assess a borrower and may affect the terms offered for certain financial products."
        ]
      }
    ],

    relatedTopics: [
      "credit-cards",
      "credit-utilization",
      "building-good-credit",
      "personal-loans"
    ]
  },


  {
    id: "credit-cards",
    category: "Credit",
    title: "Understanding Credit Cards",
    description:
      "Learn how credit cards work, how repayments work, and why responsible use matters.",

    sections: [
      {
        heading: "What is a credit card?",
        paragraphs: [
          "A credit card allows a cardholder to make purchases using a line of credit provided by the issuer."
        ]
      },
      {
        heading: "Credit is not free money",
        paragraphs: [
          "Money spent using a credit card generally becomes an amount owed to the card issuer.",
          "If the balance is not handled according to the card's terms, interest and other charges may apply."
        ]
      }
    ],

    relatedTopics: [
      "credit-score",
      "credit-utilization",
      "managing-debt"
    ]
  },


  {
    id: "credit-utilization",
    category: "Credit",
    title: "Understanding Credit Utilization",
    description:
      "Learn what credit utilization means and why it can be relevant to credit management.",

    sections: [
      {
        heading: "What is credit utilization?",
        paragraphs: [
          "Credit utilization describes how much of your available revolving credit you are currently using."
        ]
      },
      {
        heading: "Why does it matter?",
        paragraphs: [
          "Credit utilization can be one of the factors considered in credit scoring models. Keeping track of balances can therefore be an important part of responsible credit management."
        ]
      }
    ],

    relatedTopics: [
      "credit-score",
      "credit-cards",
      "building-good-credit"
    ]
  },


  {
    id: "building-good-credit",
    category: "Credit",
    title: "Building Good Credit",
    description:
      "Understand the habits that can help you maintain a healthy credit history.",

    sections: [
      {
        heading: "Paying on time",
        paragraphs: [
          "Consistently meeting repayment obligations is an important part of maintaining a positive credit history."
        ]
      },
      {
        heading: "Managing borrowed money",
        paragraphs: [
          "Keeping track of outstanding balances and avoiding borrowing beyond what you can reasonably repay can help you manage credit responsibly."
        ]
      }
    ],

    relatedTopics: [
      "credit-score",
      "credit-utilization",
      "credit-cards",
      "managing-debt"
    ]
  },


  // ============================================================
  // LOANS
  // ============================================================

  {
    id: "how-loans-work",
    category: "Loans",
    title: "How Loans Work",
    description:
      "Understand the basic structure of borrowing money and paying it back over time.",

    sections: [
      {
        heading: "What is a loan?",
        paragraphs: [
          "A loan is money provided by a lender to a borrower under agreed terms.",
          "The borrower generally agrees to repay the borrowed amount, along with applicable interest and other charges, according to the loan agreement."
        ]
      },
      {
        heading: "Important loan terms",
        paragraphs: [
          "Common terms include principal, interest rate, tenure, repayment schedule, fees, and penalties."
        ]
      }
    ],

    relatedTopics: [
      "interest",
      "emi",
      "loan-tenure",
      "personal-loans",
      "managing-debt"
    ]
  },


  {
    id: "interest",
    category: "Loans",
    title: "Understanding Interest",
    description:
      "Learn why borrowing money costs more than simply repaying the original amount.",

    sections: [
      {
        heading: "What is interest?",
        paragraphs: [
          "Interest is generally the cost of borrowing money or the return earned for lending or investing money."
        ]
      },
      {
        heading: "Why interest matters on loans",
        paragraphs: [
          "The interest rate, amount borrowed, repayment schedule, and length of the loan can all influence how much a borrower ultimately pays."
        ]
      }
    ],

    relatedTopics: [
      "how-loans-work",
      "emi",
      "loan-tenure",
      "compound-interest"
    ]
  },


  {
    id: "emi",
    category: "Loans",
    title: "Understanding EMI",
    description:
      "Learn what an Equated Monthly Instalment means when repaying certain loans.",

    sections: [
      {
        heading: "What is an EMI?",
        paragraphs: [
          "An Equated Monthly Instalment, commonly called an EMI, is a scheduled periodic payment used to repay certain loans.",
          "An EMI generally includes both a principal component and an interest component."
        ]
      },
      {
        heading: "Why EMI alone is not enough",
        paragraphs: [
          "A lower monthly payment does not automatically mean a cheaper loan. Loan tenure and interest rate also affect the total amount paid over the life of the loan."
        ]
      }
    ],

    relatedTopics: [
      "how-loans-work",
      "interest",
      "loan-tenure",
      "personal-loans"
    ]
  },


  {
    id: "loan-tenure",
    category: "Loans",
    title: "Understanding Loan Tenure",
    description:
      "Learn how the length of a loan can affect monthly payments and total borrowing costs.",

    sections: [
      {
        heading: "What is loan tenure?",
        paragraphs: [
          "Loan tenure is the period over which a borrower is scheduled to repay the loan."
        ]
      },
      {
        heading: "Shorter vs longer tenure",
        paragraphs: [
          "A longer tenure can reduce the size of individual payments but may increase the total interest paid over the life of the loan.",
          "A shorter tenure can result in higher periodic payments while potentially reducing the overall interest cost."
        ]
      }
    ],

    relatedTopics: [
      "emi",
      "interest",
      "how-loans-work",
      "personal-loans"
    ]
  },


  {
    id: "personal-loans",
    category: "Loans",
    title: "Understanding Personal Loans",
    description:
      "Learn the basic structure of personal loans and what to consider before borrowing.",

    sections: [
      {
        heading: "What is a personal loan?",
        paragraphs: [
          "A personal loan is a form of borrowing that is generally provided to an individual for an approved purpose under the lender's terms."
        ]
      },
      {
        heading: "What should you compare?",
        paragraphs: [
          "Important factors can include interest rate, processing fees, repayment tenure, EMI, prepayment conditions, and the total cost of borrowing."
        ]
      }
    ],

    relatedTopics: [
      "how-loans-work",
      "emi",
      "interest",
      "loan-tenure",
      "credit-score"
    ]
  },


  {
    id: "home-loans",
    category: "Loans",
    title: "Understanding Home Loans",
    description:
      "Learn the basics of borrowing money to purchase or finance a home.",

    sections: [
      {
        heading: "What is a home loan?",
        paragraphs: [
          "A home loan is financing provided by a lender for purposes related to purchasing, constructing, or financing residential property under agreed terms."
        ]
      },
      {
        heading: "Important considerations",
        paragraphs: [
          "Borrowers should understand the interest rate, tenure, EMI, fees, repayment conditions, and the total cost of the loan before committing."
        ]
      }
    ],

    relatedTopics: [
      "how-loans-work",
      "emi",
      "interest",
      "loan-tenure"
    ]
  },


  // ============================================================
  // INSURANCE
  // ============================================================

  {
    id: "why-insurance-matters",
    category: "Insurance",
    title: "Why Insurance Matters",
    description:
      "Understand the basic purpose of insurance and how it can help manage financial risk.",

    sections: [
      {
        heading: "What is insurance?",
        paragraphs: [
          "Insurance is a financial arrangement designed to provide protection against specified risks in exchange for a premium and subject to the policy's terms and conditions."
        ]
      },
      {
        heading: "Why people use insurance",
        paragraphs: [
          "Insurance can help reduce the financial impact of certain unexpected events that could otherwise create a significant financial burden."
        ]
      }
    ],

    relatedTopics: [
      "health-insurance",
      "life-insurance",
      "term-insurance",
      "financial-plan"
    ]
  },


  {
    id: "health-insurance",
    category: "Insurance",
    title: "Understanding Health Insurance",
    description:
      "Learn the basic purpose of health insurance and what policy terms you should understand.",

    sections: [
      {
        heading: "What is health insurance?",
        paragraphs: [
          "Health insurance is designed to provide financial coverage for specified healthcare-related expenses according to the terms of the policy."
        ]
      },
      {
        heading: "What should you check?",
        paragraphs: [
          "Important policy details can include coverage, exclusions, waiting periods, deductibles, limits, network hospitals, and premium."
        ]
      }
    ],

    relatedTopics: [
      "why-insurance-matters",
      "life-insurance",
      "term-insurance"
    ]
  },


  {
    id: "life-insurance",
    category: "Insurance",
    title: "Understanding Life Insurance",
    description:
      "Learn why people use life insurance and the basic concepts behind it.",

    sections: [
      {
        heading: "What is life insurance?",
        paragraphs: [
          "Life insurance provides financial protection according to the terms of a policy when a covered event occurs."
        ]
      },
      {
        heading: "Why can it matter?",
        paragraphs: [
          "Life insurance can be particularly relevant when other people depend financially on the policyholder."
        ]
      }
    ],

    relatedTopics: [
      "term-insurance",
      "why-insurance-matters",
      "financial-plan"
    ]
  },


  {
    id: "term-insurance",
    category: "Insurance",
    title: "Understanding Term Insurance",
    description:
      "Learn the basic idea behind term insurance and how it differs from other forms of life insurance.",

    sections: [
      {
        heading: "What is term insurance?",
        paragraphs: [
          "Term insurance generally provides life coverage for a specified period according to the terms of the policy."
        ]
      },
      {
        heading: "Why people consider it",
        paragraphs: [
          "Term insurance is commonly considered as a way to provide financial protection to dependents during a defined period."
        ]
      }
    ],

    relatedTopics: [
      "life-insurance",
      "why-insurance-matters"
    ]
  },


  // ============================================================
  // FINANCIAL PLANNING
  // ============================================================

  {
    id: "budgeting",
    category: "Financial Planning",
    title: "Understanding Budgeting",
    description:
      "Learn how a budget can help you plan where your money should go before you spend it.",

    sections: [
      {
        heading: "What is a budget?",
        paragraphs: [
          "A budget is a plan for how you expect to allocate your available money over a period of time."
        ]
      },
      {
        heading: "Why budget?",
        paragraphs: [
          "A budget can help you understand your spending, identify priorities, and make room for savings or financial goals."
        ]
      }
    ],

    relatedTopics: [
      "income-vs-expenses",
      "cash-flow",
      "financial-goals",
      "financial-plan"
    ]
  },


  {
    id: "managing-debt",
    category: "Financial Planning",
    title: "Managing Debt",
    description:
      "Understand how to think about debt and make borrowing a manageable part of your financial life.",

    sections: [
      {
        heading: "What is debt?",
        paragraphs: [
          "Debt is money that you owe to another party, usually as a result of borrowing."
        ]
      },
      {
        heading: "Why manage debt carefully?",
        paragraphs: [
          "Debt creates future financial obligations. Interest, repayment schedules, and multiple outstanding balances can affect how much of your future income is already committed."
        ]
      }
    ],

    relatedTopics: [
      "how-loans-work",
      "interest",
      "credit-score",
      "financial-plan"
    ]
  },


  {
    id: "financial-plan",
    category: "Financial Planning",
    title: "Building a Financial Plan",
    description:
      "Bring saving, spending, investing, debt, protection, and goals together into one financial picture.",

    sections: [
      {
        heading: "What is a financial plan?",
        paragraphs: [
          "A financial plan is a structured way of thinking about your current financial position, future goals, resources, risks, and the actions needed to move toward those goals."
        ]
      },
      {
        heading: "What can it include?",
        paragraphs: [
          "A personal financial plan may include budgeting, emergency savings, debt management, investing, insurance, financial goals, and long-term planning."
        ]
      }
    ],

    relatedTopics: [
      "financial-goals",
      "budgeting",
      "building-an-emergency-fund",
      "managing-debt",
      "investing"
    ]
  },


  // ============================================================
  // ECONOMICS / EVERYDAY FINANCE
  // ============================================================

  {
    id: "inflation",
    category: "Everyday Finance",
    title: "Understanding Inflation",
    description:
      "Learn what inflation means and why changing prices matter to your everyday financial decisions.",

    sections: [
      {
        heading: "What is inflation?",
        paragraphs: [
          "Inflation refers to a general increase in the prices of goods and services over time."
        ]
      },
      {
        heading: "Why does inflation matter?",
        paragraphs: [
          "When prices rise, the same amount of money may buy fewer goods and services than it could previously."
        ]
      }
    ],

    relatedTopics: [
      "purchasing-power",
      "interest-rates",
      "investing",
      "saving"
    ]
  },


  {
    id: "purchasing-power",
    category: "Everyday Finance",
    title: "Understanding Purchasing Power",
    description:
      "Learn how the value of money changes when the prices of goods and services change.",

    sections: [
      {
        heading: "What is purchasing power?",
        paragraphs: [
          "Purchasing power describes how much goods and services a given amount of money can buy."
        ]
      },
      {
        heading: "Inflation and purchasing power",
        paragraphs: [
          "When prices rise broadly, the purchasing power of a fixed amount of money generally falls."
        ]
      }
    ],

    relatedTopics: [
      "inflation",
      "saving",
      "investing"
    ]
  },


  {
    id: "interest-rates",
    category: "Everyday Finance",
    title: "Understanding Interest Rates",
    description:
      "Learn why interest rates matter for savings, investments, loans, and the wider economy.",

    sections: [
      {
        heading: "What is an interest rate?",
        paragraphs: [
          "An interest rate represents the rate at which interest is charged on borrowed money or earned on certain financial products, depending on the context."
        ]
      },
      {
        heading: "Why do interest rates matter?",
        paragraphs: [
          "Interest rates can influence the cost of borrowing, the return available on certain savings or investments, and broader economic activity."
        ]
      }
    ],

    relatedTopics: [
      "interest",
      "inflation",
      "how-loans-work",
      "compound-interest"
    ]
  },


  {
    id: "taxes",
    category: "Everyday Finance",
    title: "Understanding Taxes",
    description:
      "Learn the basic idea behind taxes and why they form an important part of personal finance.",

    sections: [
      {
        heading: "What are taxes?",
        paragraphs: [
          "Taxes are compulsory financial contributions collected by governments according to applicable laws and regulations."
        ]
      },
      {
        heading: "Why should you understand them?",
        paragraphs: [
          "Taxes can affect income, investments, purchases, property, and other financial activities. Understanding the rules that apply to you can help you plan more effectively."
        ]
      }
    ],

    relatedTopics: [
      "income-vs-expenses",
      "financial-plan",
      "investing"
    ]
  }
];

export default financeTopics;