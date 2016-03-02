using System;
using System.Linq;
using System.Linq.Expressions;
using ExpenseTracker.Model;

namespace ExpenseTracker.DataAccess
{
    public interface IRepository<T> : IDisposable where T : class, IIdentifiable
    {
        IQueryable<T> All { get; }
        IQueryable<T> AllEager(params Expression<Func<T, object>>[] includes);
        T Find(int id, string userName);
        bool FindId(int id, string userName);
        void Insert(T entity);
        void Update(T entity);
        void Delete(int id);
        IQueryable<T> AllByUser(string userName);
    }
}
