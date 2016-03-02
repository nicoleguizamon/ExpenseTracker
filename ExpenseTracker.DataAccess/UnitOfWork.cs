namespace ExpenseTracker.DataAccess
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IContext context;
        public UnitOfWork()
        {
            context = new ExContext();
        }
        public UnitOfWork(IContext context)
        {
            this.context = context;
        }
        public int Save()
        {
            return context.SaveChanges();
        }
        public IContext Context
        {
            get
            {
                return context;
            }
        }
        public void Dispose()
        {
            context.Dispose();
        }
    }
}
