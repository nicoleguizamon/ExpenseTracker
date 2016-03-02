using System;

namespace ExpenseTracker.DataAccess
{
    public interface IUnitOfWork : IDisposable
    {
        int Save();
        IContext Context { get; }
    }
}
