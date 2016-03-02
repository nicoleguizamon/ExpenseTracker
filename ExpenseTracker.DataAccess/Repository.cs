using System;
using System.Linq;
using System.Data.Entity;
using System.Linq.Expressions;
using ExpenseTracker.Model;

namespace ExpenseTracker.DataAccess
{
    public class Repository<T> : IRepository<T> where T : class, IIdentifiable
    {
        private readonly ExContext context;
        public Repository(IUnitOfWork uow)
        {
            context = uow.Context as ExContext;
        }
        public IQueryable<T> All
        {
            get
            {
                return context.Set<T>();
            }
        }
        
        public IQueryable<T> AllEager(params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = context.Set<T>();
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return query;
        }
        public T Find(int id, string userName)
        {
            return context.Set<T>().FirstOrDefault(x => x.UserId == userName && x.Id == id);
        }
        public bool FindId(int id, string userName)
        {
            return context.Set<T>().Any(x => x.UserId == userName && x.Id == id);
        }
        public void Insert(T item)
        {
            context.Entry(item).State = EntityState.Added;
        }
        public void Update(T item)
        {
            context.Set<T>().Attach(item);
            context.Entry(item).State = EntityState.Modified;
        }
        public void Delete(int id)
        {
            var item = context.Set<T>().Find(id);
            context.Set<T>().Remove(item);
        }
        public IQueryable<T> AllByUser(string userName)
        {
            return context.Set<T>().Where(x => x.UserId == userName);
        }
        public void Dispose()
        {
            context.Dispose();
        }
    }
}
