using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpenseTracker.DataAccess
{
    public interface IContext : IDisposable
    {
        int SaveChanges();
    }
}
