using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpenseTracker.Model
{
    public class PdfReport
    {
        public int Year { get; set; }
        public int WeekNumber { get; set; }
        public decimal Amount { get; set; }
        public decimal Average { get; set; }
    }
}
