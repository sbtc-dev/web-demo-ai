"use client"

import { useState } from "react"
import { useLoyalty } from "@/contexts/loyalty-context"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpCircle, ArrowDownCircle, Clock, Gift, Search } from "lucide-react"

interface LoyaltyTransactionHistoryProps {
  limit?: number
}

export default function LoyaltyTransactionHistory({ limit }: LoyaltyTransactionHistoryProps) {
  const loyalty = useLoyalty()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const transactions = loyalty.getTransactionHistory()

  // Apply filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by type
    if (filterType !== "all" && transaction.type !== filterType) {
      return false
    }

    // Filter by search term
    if (
      searchTerm &&
      !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Apply limit if provided
  const displayedTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "EARNED":
        return <ArrowUpCircle className="h-5 w-5 text-green-500" />
      case "REDEEMED":
        return <ArrowDownCircle className="h-5 w-5 text-red-500" />
      case "EXPIRED":
        return <Clock className="h-5 w-5 text-gray-500" />
      case "BONUS":
        return <Gift className="h-5 w-5 text-purple-500" />
      default:
        return <ArrowUpCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="EARNED">Points Earned</SelectItem>
              <SelectItem value="REDEEMED">Points Redeemed</SelectItem>
              <SelectItem value="EXPIRED">Points Expired</SelectItem>
              <SelectItem value="BONUS">Bonus Points</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {displayedTransactions.length > 0 ? (
        <div className="space-y-3">
          {displayedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>{formatDate(transaction.timestamp)}</span>
                    {transaction.orderId && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>Order #{transaction.orderId}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${transaction.points > 0 ? "text-green-600" : "text-red-600"}`}>
                  {transaction.points > 0 ? "+" : ""}
                  {transaction.points} points
                </div>
                {transaction.expiryDate && (
                  <div className="text-xs text-gray-500">Expires: {formatDate(transaction.expiryDate)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No transactions found</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm || filterType !== "all"
              ? "Try changing your filters"
              : "Your transaction history will appear here"}
          </p>
        </div>
      )}

      {limit && transactions.length > limit && (
        <div className="text-center text-sm text-gray-500 pt-2">
          Showing {limit} of {transactions.length} transactions
        </div>
      )}
    </div>
  )
}